import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo, // sans cela, cause des erreurs car last n'est pas wrapped dans un hook et ça change tous les render
  useState,
} from "react";

const DataContext = createContext({});

export const api = { // un objet api est exporté, la méthode loadData va chercher events.json
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null); // variable last, tableau avec deux éléments

  const getData = useCallback(async () => { // la fonction hook useCallback va chercher la méthode api loadData
    try {
      const loadedData = await api.loadData(); // fait le fetch via la méthode
      setData(loadedData);
      setLast(loadedData.events[loadedData.events.length - 1]); // setlast: -1 = va chercher le dernier élément et met à jour last
    } catch (err) {
      setError(err);
    }
  }, []); // array vide pour signifier que getdata ne dépend d'aucune valeur externe

  useEffect(() => {
    if (data) return;
    getData();
  }, [data, getData]);

  const contextValue = useMemo(() => ({ data, error, last }), [
    data,
    error,
    last,
  ]);

  return ( // wrap le children
    <DataContext.Provider value={contextValue}> 
      {children} 
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;
