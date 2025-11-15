import { ComponentType, PropsWithChildren } from "react";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
            refetchOnMount: false,
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
});
const QueryClientWrapper = ({ children }: PropsWithChildren) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

const Google0AuthProviderWrapper = ({ children }: PropsWithChildren) => {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            {children}
        </GoogleOAuthProvider>
    );
};


const withProviders =
    (...providers: ComponentType<PropsWithChildren>[]) =>
        (Component: ComponentType<PropsWithChildren>) => {
            return providers.reduceRight((PrevComponent, Provider) => {
                function WrappedComponent(props: PropsWithChildren) {
                    return (
                        <Provider>
                            <PrevComponent {...props} />
                        </Provider>
                    );
                }
                WrappedComponent.displayName = `With${Provider.displayName || Provider.name
                    }`;
                return WrappedComponent;
            }, Component);
        };

const Providers = withProviders(
    Google0AuthProviderWrapper,
    QueryClientWrapper,
    AuthProvider,
)(({ children }) => children);


export { Providers };
