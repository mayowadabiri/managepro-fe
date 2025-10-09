
import Loader from "./Loader";
import Stack from "./Stack";
import Typography from "./Typography";

const FullHeightLoader = () => {

    return (
        <Stack className="h-screen" align="center" justify="center" gap="2">
            <Loader />
            <Typography variant="black" size="3xl" weight="semibold">
                Loading
            </Typography>
            <Typography className="text-gray600" size="xl" weight="semibold">
                Please Wait
            </Typography>
        </Stack>
    );
};
export default FullHeightLoader;
