# RideAnything: Bond (Veiligheidsassistent)

Bond is een gespecialiseerde AI-assistent ontwikkeld voor Walibi Holland. Deze applicatie is ontworpen om medewerkers en bezoekers direct te ondersteunen bij vragen over veiligheidseisen, parkreglementen en de impact van actuele weersomstandigheden op de attracties.

## Use Case
In een complexe omgeving als een attractiepark is snelle toegang tot veiligheidsprotocollen cruciaal. Bond fungeert als een digitale expert die:
- Vragen beantwoordt over het **Warenwetbesluit attractie- en speeltoestellen (WAS)**.
- Live weersomstandigheden (temperatuur en neerslag) ophaalt via de **OpenWeatherMap API**.
- Specifieke informatie "retrieved" uit meer dan **10 pagina's aan technische handleidingen** en parkdocumenten via RAG (Retrieval-Augmented Generation).
- Context onthoudt binnen een gesprek dankzij **Checkpointer Memory**.

## Installatie & Setup

Volg de onderstaande stappen om de applicatie lokaal te installeren en te draaien:

### 1. Dependencies installeren
Zorg dat je Node.js hebt geïnstalleerd en voer het volgende commando uit in je terminal:

```
npm install
```

### 2. Maak een ENV file aan
```
AZURE_OPENAI_API_KEY=jouw_key_hier
AZURE_OPENAI_API_INSTANCE_NAME=jouw_instance_naam
AZURE_OPENAI_API_DEPLOYMENT_NAME=jouw_deployment_naam
AZURE_OPENAI_API_VERSION=2024-02-15-preview
AZURE_EMBEDDINGS_DEPLOYMENT_NAME=jouw_embeddings_deployment
MY_WEATHER_KEY=jouw_openweathermap_api_key
```

### 3. Vul je database door in de terminal het volgende te draaien:
```
node save.js
```

### 4. Draai de server

```
node server.js
```
Open je browser en ga naar: http://localhost:3000

### Gefeliciteerd! Als het goed is draait hij nu en kan je chatten met Bond!
