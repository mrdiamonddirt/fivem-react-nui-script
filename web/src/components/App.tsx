import React, { useState } from "react";
import "./App.css";
import { debugData } from "../utils/debugData";
import { fetchNui } from "../utils/fetchNui";

// This will set the NUI to visible if we are
// developing in browser
debugData([
    {
        action: "setVisible",
        data: true,
    },
]);

interface ReturnClientDataCompProps {
    data: any;
}

const ReturnClientDataComp: React.FC<ReturnClientDataCompProps> = ({
    data,
}) => (
    <>
        <h5>Returned Data:</h5>
        <pre>
            <code>{JSON.stringify(data, null)}</code>
        </pre>
    </>
);

interface ReturnData {
    x: number;
    y: number;
    z: number;
}

const App: React.FC = () => {
    const [clientData, setClientData] = useState<ReturnData | null>(null);

    const handleGetClientData = () => {
        fetchNui<ReturnData>("getClientData")
            .then((retData) => {
                console.log("Got return data from client scripts:");
                console.dir(retData);
                setClientData(retData);
            })
            .catch((e) => {
                console.error("Setting mock data due to error", e);
                setClientData({ x: 500, y: 300, z: 200 });
            });
    };

    const [opentab, setopentab] = useState(false);

    const handleCreateNewNui = () => {
        setopentab(true);
        console.log("Opening new NUI", opentab);
    };

    const closewindow = () => {
        setopentab(false);
        console.log("Closing NUI", opentab);
    };

    const handleSpawnPed = () => {
        // Register the callback for the 'spawnPed' event
        RegisterNUICallback("spawnPed", function (data) {
            console.log("Received response from server:", data);
        });

        // Send a message to the server to trigger the 'spawnPed' event
        SendNUIMessage({
            action: "spawnPed",
            data: {
                model: "a_m_y_skater_01",
                x: -1036.312,
                y: -2737.724,
                z: 20.169,
            },
        });
    };

    return (
        <div className="nui-wrapper">
            <div className="popup-thing">
                <div>
                    <h1>This is the NUI Popup!</h1>
                    <p>Exit with the escape key</p>
                    <button onClick={handleGetClientData}>
                        Get Client Data
                    </button>
                    <button onClick={handleCreateNewNui}>
                        Open Another Window
                    </button>
                    {clientData && <ReturnClientDataComp data={clientData} />}
                </div>
            </div>
            {opentab ? (
                <div className="popup-thing2">
                    <div>
                        <h1>This is another NUI Popup!</h1>
                        <button onClick={closewindow}>close</button>
                        <button onClick={handleSpawnPed}>Spawn Ped</button>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default App;
