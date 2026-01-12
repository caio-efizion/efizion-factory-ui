interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    loading: boolean;
}
interface RequestOptions {
    method: string;
    headers: HeadersInit;
    body?: string;
}
declare const useApi: <T>(endpoint: string, options: RequestOptions) => ApiResponse<T>;
export default useApi;
