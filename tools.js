import "dotenv/config";
import * as z from "zod"
import {tool} from "langchain"
import { AzureOpenAIEmbeddings } from "@langchain/openai"
import { FaissStore } from "@langchain/community/vectorstores/faiss"

export const getWeather = tool(
    async ({ city }) => {
        const apiKey = process.env.MY_WEATHER_KEY
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`

        try {
            const response = await fetch(url)
            if (!response.ok) return `Ik kon het weer niet ophalen van ${city}.`

            const data = await response.json()
            const desc = data.weather[0].description
            const temp = data.main.temp

            return `In ${city}, is het nu ${desc} met een temperatuur van ${temp}°C.`
        } catch (error) {
            return `Error fetching weather: ${error.message}`
        }
    },
    {
        name: "get_weather",
        description: "Geeft de huidige weer en temperatuur terug voor een specifieke stad",
        schema: z.object({
            city: z.string().describe("De naam van de stad"),
        })
    },
)

export const readDate = tool (

    ({  }) => {
        const today = new Date()
        const readableDate = today.toLocaleDateString("nl-NL", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        console.log(`🔧 de date tool wordt uitgevoerd!`)
        return `Het is vandaag ${readableDate}!`
    },
    {
        name: "read_date",
        description: "Geeft de datum van vandaag terug",
        schema:
           z.object({})
        ,
    },
)

export const myToolResponse = z.object({
    message: z.string().describe("Het bericht aan de user"),
    toolsUsed: z.array(z.string()).describe("Lijst met namen van tools die gebruikt worden in het antwoord, zonder de woord functie" )
})

//document reader
const embeddings = new AzureOpenAIEmbeddings({
    temperature: 0,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME
})

const vectorStore = await FaissStore.load("./documents", embeddings)
console.log("✅ vector store loaded!")

export const retrieve = tool(
    async ({ query }) => {
        console.log("🔧 now searching the document store")
        const relevantDocs = await vectorStore.similaritySearch(query, 2)
        console.log("/////Node.js document check////////")
        relevantDocs.forEach((doc, i) => {
            console.log(`Match ${i+1}: Gevonden in bestand: ${doc.metadata.source}`)
        })

        const context = relevantDocs.map(doc => doc.pageContent).join("\n\n")
        return context

    },
    {
        name: "retrieve",
        description: "Zoek in de officiële documenten naar informatie over veiligheid, wetgeving (WAS 2023), het Walibi reglement, NVWA-beleid en technische eisen voor attracties.",
        schema: z.object({
            query: z.string().describe("De zoekterm om informatie te vinden in de documenten"),
        })
    }
)
