import { useGetAccount } from "@/api/auth";
import FullHeightLoader from "@/components/FullHeightLoader";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
    const { data, isSuccess, isPending, isError } = useGetAccount();
    const { setUser } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (isSuccess) {
            setUser(data.data);
        }
    }, [isSuccess, data, setUser]);

    useEffect(() => {
        if (isError) {
            navigate({ to: "/auth/login" });
        }
    }, [isError, navigate]);

    if (isPending) {
        return <FullHeightLoader />;
    }

    if (isSuccess) {
        return children;
    }
    return <div />;
};

export default ProtectedLayout;
