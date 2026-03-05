import axios from "axios";

export async function getVitals(): Promise<string> {
    const response = await axios.get('/vitals')
    return response.data;
}

export const createVital = async (vital: any) => {
    const response = await axios.post('/vitals', vital)
    return response.data;
}