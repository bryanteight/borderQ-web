export interface PortMetadata {
    id: string;
    name: string;
    summary: string;
    uniqueness: string;
    typicalWait: string;
    faqs: { question: string; answer: string }[];
}

export const PORT_METADATA: Record<string, PortMetadata> = {
    "peace-arch": {
        id: "peace-arch",
        name: "Peace Arch / Douglas",
        summary: "The Peace Arch border crossing is the primary gateway for travelers moving between Seattle and Vancouver. Located on I-5 (USA) and Highway 99 (Canada), it is the most popular choice for families and tourists visiting the Pacific Northwest. Plan your Seattle to Vancouver border crossing with our live AI wait time predictions.",
        uniqueness: "Peace Arch is unique for its dedicated park spanning the international boundary. It is a 24/7 port of entry and offers both NEXUS and standard passenger lanes. Note: Commercial trucks are not permitted at this crossing and must use Pacific Highway instead.",
        typicalWait: "Typical wait times at Peace Arch range from 15 to 45 minutes on weekdays, but can surge to over 90 minutes during summer weekends and holidays. The best time to cross is usually before 8:00 AM or after 8:00 PM.",
        faqs: [
            {
                question: "Which border crossing is best for Seattle to Vancouver?",
                answer: "The Peace Arch crossing is generally considered the best and most direct route for passenger vehicles traveling between Seattle and Vancouver via I-5. However, if lines are long, the Pacific Highway (Truck Crossing) is just minutes away and often has shorter waits for PAX vehicles."
            },
            {
                question: "How long is the wait at Peace Arch right now?",
                answer: "Wait times at Peace Arch fluctuate throughout the day. Check our live dashboard above for real-time AI-powered estimations and historical patterns for today."
            },
            {
                question: "What are the requirements for Seattle to Vancouver border crossing?",
                answer: "Travelers need a valid passport, NEXUS card, or Enhanced Driver's License (EDL). Ensure you have no restricted items and check current travel advisories before departing Seattle for your trip to Vancouver."
            }
        ]
    },
    "pacific-highway": {
        id: "pacific-highway",
        name: "Pacific Highway",
        summary: "Known as the Truck Crossing, Pacific Highway is a vital link for both commercial and passenger traffic between BC and Washington State. It is located just 1 mile east of Peace Arch and often serves as an efficient alternative for those traveling from Seattle to Vancouver.",
        uniqueness: "Pacific Highway is the primary commercial crossing in the region but also features extensive NEXUS and standard lanes for passenger vehicles. It is open 24/7 and often handles heavy traffic more efficiently than Peace Arch during peak periods.",
        typicalWait: "Wait times here are often slightly lower than Peace Arch during peak tourism hours. Standard waits average 20-30 minutes, though commercial volume can impact approach times.",
        faqs: [
            {
                question: "Can passenger vehicles use the Pacific Highway crossing?",
                answer: "Yes, passenger vehicles (PAX) are welcome and often find shorter wait times here compared to the nearby Peace Arch, especially during holiday weekends."
            },
            {
                question: "Is Pacific Highway open 24 hours?",
                answer: "Yes, the Pacific Highway port of entry operates 24 hours a day, 7 days a week for both commercial and passenger traffic."
            }
        ]
    },
    "lynden": {
        id: "lynden",
        name: "Lynden / Aldergrove",
        summary: "The Lynden (Alder Grove) crossing provides a more rural and often quieter alternative for travelers heading toward the Fraser Valley or eastern Vancouver suburbs. It's an excellent choice for avoiding the congestion of the main I-5 corridors.",
        uniqueness: "Lynden connects WA-539 to BC-13. It has specific operating hours (8:00 AM to midnight) and is perfect for travelers who prefer scenic routes over highway congestion.",
        typicalWait: "Wait times are generally much shorter here, often under 10 minutes. However, because it has fewer lanes, any surge in traffic can cause quick delays.",
        faqs: [
            {
                question: "What are the hours for the Lynden border crossing?",
                answer: "The Lynden-Aldergrove port of entry is open daily from 8:00 AM to 12:00 AM (Midnight)."
            }
        ]
    }
};
