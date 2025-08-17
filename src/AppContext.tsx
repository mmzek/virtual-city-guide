import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface AttractionsData {
  name: string | null;
  attractionLon: number;
  attractionLat: number;
  amenity: string | null;
  address: string;
  url: string | null;
}

interface AppContextType {
  position: any[];
  setPosition: React.Dispatch<React.SetStateAction<any[]>>;
  markers: any[];
  setMarkers: React.Dispatch<React.SetStateAction<any[]>>;
  selectedMarker: any;
  setSelectedMarker: React.Dispatch<React.SetStateAction<any>>;
  attractions: AttractionsData[];
  setAttractions: React.Dispatch<React.SetStateAction<AttractionsData[]>>;
  addToPlaner: any;
  setAddToPlaner: React.Dispatch<React.SetStateAction<any>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [position, setPosition] = useState([52.2297, 21.0122]);
  const [markers, setMarkers] = useState<any[]>([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [attractions, setAttractions] = useState<AttractionsData[]>([]);
  const [addToPlaner, setAddToPlaner] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setPosition([latitude, longitude]);
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        position,
        setPosition,
        markers,
        setMarkers,
        selectedMarker,
        setSelectedMarker,
        attractions,
        setAttractions,
        addToPlaner,
        setAddToPlaner,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  const appContext = useContext(AppContext);
  if (appContext === undefined) {
    throw Error("user is undefined");
  }
  return appContext;
}
