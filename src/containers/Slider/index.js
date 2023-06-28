import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
  );
  const nextCard = () => {
    setIndex(index < (byDateDesc && byDateDesc.length - 1) ? index + 1 : 0); // mis le timeout dans useeffect et mis le setindex conditionné aux lenghts qui doivent exister
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      nextCard();
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, [nextCard]);
  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
          <div
            key={event.title}
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
        ))}
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc?.map((event, radioIdx) => ( // event au lieu d'underscore, cf ligne 45
                <input
                  key={event.title} // changé la prop pour en avoir une unique car erreur dans la console quand plusieurs ("$.id")
                  type="radio"
                  name="radio-button"
                  checked={radioIdx === index}
                  onChange={() => setIndex(radioIdx)} // ajouté onchange et changé la key et le checked sur index
                />
              ))}
            </div>
          </div>
    </div> // restructuré le html, lignes 40 et 25, pas deux fois "event" dans la même section
  );
};

export default Slider;
