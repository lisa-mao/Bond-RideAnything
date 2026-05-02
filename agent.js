import 'dotenv/config'
import { AzureChatOpenAI } from "@langchain/openai"
import { createAgent } from "langchain"
import { MemorySaver } from "@langchain/langgraph"
import { getWeather, readDate, myToolResponse, retrieve } from "./tools.js"

const checkpointer = new MemorySaver()
const model = new AzureChatOpenAI({ temperature: 0 })

const agent = createAgent({
    model,
    tools: [getWeather, readDate, retrieve],
    checkpointer,
    responseFormat: myToolResponse,
    system: "JE BENT BOND, DE VEILIGHEIDSASSISTENT VAN WALIBI. GEBRUIK ALLEEN DE TOOLS EN DOCUMENTEN. ANTWOORD NIET OP NIET-RELEVANTE VRAGEN."
})

export async function callAgent(prompt, thread_id = "1") {
    try {
        const result = await agent.invoke(
            { messages: [{ role: "user", content: prompt }] },
            { configurable: { thread_id: thread_id } }
        )

        const rawResponse = result.structuredResponse
        const finalMessageContent = result.messages.at(-1).content

        // Als de agent de 'Returning structured response' tekst gebruikt
        if (typeof rawResponse === "string" && rawResponse.includes("Returning structured response:")) {
            const jsonString = rawResponse.split("Returning structured response: ")[1]
            const parsed = JSON.parse(jsonString)

            return {
                message: parsed.message,
                tools: parsed.toolsUsed || []
            }
        }

        if (typeof rawResponse === "object" && rawResponse !== null) {
            return {
                message: rawResponse.message,
                tools: rawResponse.toolsUsed || []
            }
        }

        return {
            message: finalMessageContent,
            tools: []
        }

    } catch (error) {
        console.error("Fout in agent.js:", error)
        return {
            message: "Sorry, de assistent is buiten bewerking",
            tools: []
        }
    }
}