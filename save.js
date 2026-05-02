import "dotenv/config";

import { AzureOpenAIEmbeddings, AzureChatOpenAI } from "@langchain/openai";
import {TextLoader} from "@langchain/classic/document_loaders/fs/text";
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";
import {DirectoryLoader} from "@langchain/classic/document_loaders/fs/directory";
import {FaissStore} from "@langchain/community/vectorstores/faiss";


const embeddings = new AzureOpenAIEmbeddings({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    temperature: 0,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_EMBEDDINGS_DEPLOYMENT_NAME,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION
})

const loader = new DirectoryLoader("./documents",
    {
        ".txt": (path) => new TextLoader(path),
    }
    )
const docs = await loader.load()

const textSplitter = new RecursiveCharacterTextSplitter({chunkSize: 1000, chunkOverlap: 200 });
const chunks = await textSplitter.splitDocuments(docs)

const vectorStore = await FaissStore.fromDocuments(chunks, embeddings)
const directory = "./documents"
await vectorStore.save(directory);
console.log("✅ vector store created!")
