import { useEffect, useState } from "react";
import {Alert} from "@heroui/alert";

const NetworkStatusAlert = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
	    const [isRestored, setIsRestored] = useState(false);


    useEffect(() => {
        const handleOffline = () => {
            setIsOffline(true);
            setIsRestored(false);
        };

        const handleOnline = () => {
            setIsOffline(false);
            setIsRestored(true);

            // Hide the restored alert after 5 seconds
            setTimeout(() => {
                setIsRestored(false);
            }, 10000);
        };

        window.addEventListener("offline", handleOffline);
        window.addEventListener("online", handleOnline);

        return () => {
            window.removeEventListener("offline", handleOffline);
            window.removeEventListener("online", handleOnline);
        };
    }, []);

	return (
		<>
		{isOffline && (
        <div className="fixed top-2 md:top-auto md:bottom-3 left-1/2 transform -translate-x-1/2 w-11/12 md:w-1/2 z-50">
                <Alert
                    color="warning"
                    title="You are offline"
                    description="Check your internet connection."
                    variant="faded"
                />
                   
			</div>
			)}

			{isRestored && (
                <div className="fixed top-2 md:top-auto md:bottom-3 left-1/2 transform -translate-x-1/2 w-11/12 md:w-1/2 z-50">
                    <Alert
                        color="success"
                        title="Internet connection restored"
                        description="You're back online."
                        variant="faded"
                    />
                </div>
            )}
		</>
    );
};

export default NetworkStatusAlert;
