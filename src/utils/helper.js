const fetchApi = async ({ url, method, data, isAuthRequired = null, isFile = false }) => {
    const token = localStorage.getItem("auth");
    const customHeaders = isAuthRequired && {
        "authorization": `Bearer ${token}`,
    };

    try {
        const headers = {
            'Content-Type': isFile ? "multipart/form-data" : 'application/json',
            ...customHeaders
        };
        const requestConfig = { method, headers };
        if (data) {
            requestConfig.body = JSON.stringify(data);
        }
        const response = await fetch(url, requestConfig);
        const result = await response.json();

        if (result.status === 403) {
            localStorage.removeItem("auth");
        }
        return result;
    } catch (error) {
        console.error("ERROR: " + error);
    }
};
export default fetchApi;