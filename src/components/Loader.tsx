import { RotatingLines } from "react-loader-spinner";

const Loader = ({ width = "64", color = "grey", ...props }: any) => {
    return (
        <RotatingLines
            visible
            width={width as string}
            strokeColor={color}
            strokeWidth="2"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
            {...props}
        />
    );
};

export default Loader;
