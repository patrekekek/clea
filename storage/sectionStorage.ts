import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "sections";

export type Section = {
    id: string,
    name: string
};

// Loading sections
export async function loadSections(): Promise<Section[]> {
    const data = await AsyncStorage.getItem(KEY);
    return data ? JSON.parse(data) : []
}

// savign section
export async function saveSections(sections: Section[]) {
    await AsyncStorage.setItem(KEY, JSON.stringify(sections));
}