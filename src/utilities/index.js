const base_url = process.env.NEXT_PUBLIC_BASE_URL;

// ---------------------------------------------

export const FetchApi = async ({ url, method = "GET", data = null, token = null }) => {
    try {
        const fullUrl = `${base_url}${url}`;

        const headers = {};
        if (!(data instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const options = {
            method: method.toUpperCase(),
            headers,
            next: { tags: ["priyanshu-portfolio"] },
        };

        if (["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase()) && data) {
            options.body = data instanceof FormData ? data : JSON.stringify(data);
        }

        const response = await fetch(fullUrl, options);

        const contentType = response.headers.get("content-type");
        const parsedData = contentType?.includes("application/json")
            ? await response.json()
            : await response.text();

        return {
            status: response.status,
            success: response.ok,
            data: parsedData,
        };
    } catch (error) {
        console.error("FetchApi Error:", error);
        return {
            status: 500,
            success: false,
            data: { message: "Something went wrong" },
        };
    }
};

