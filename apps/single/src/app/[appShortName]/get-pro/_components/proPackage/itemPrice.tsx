import LazyLoadImage from "@/components/images";
import { useIsMobile } from "@/hooks/useIsMobile";
import { IPriceConfig } from "@/utils/paypal";

const ItemPrice = ({
    price,
    active = false,
    handleActive,
}: {
    price: IPriceConfig;
    active: boolean;
    handleActive: () => void;
}) => {
    const {
        price: salePrice,
        initPrice,
        type,
        averagePrice,
        trialDay,
        savePrice,
    } = price;

    const isMobile = useIsMobile();
    return (
        <div
            className={`price-item ${active ? "active" : ""}`}
            onClick={handleActive}
        >
            {active && (
                <div className="icon-check">
                    <LazyLoadImage
                        src="/images/passemall/new-pro/check-price.png"
                        alt="icon-check"
                    />
                </div>
            )}
            {isMobile ? (
                <>
                    <div
                        className={
                            "text-save-price " + (active ? "active" : "")
                        }
                        id="text-save-price"
                    >
                        {savePrice?.text && (
                            <div className="text">{savePrice?.text}</div>
                        )}
                    </div>
                    <div className="price-item-container">
                        <div className="price-section">
                            <span className="sale-price">${salePrice}</span>
                        </div>
                        <div className="type">{type}</div>
                        <div className="divide"></div>
                        <div className="average-price">
                            Just <b>${averagePrice} </b>
                        </div>
                        <div className="day">Per Day</div>
                        <div className="trial-day">
                            {trialDay && (
                                <>
                                    {trialDay}-days <b>FREE</b> trial
                                </>
                            )}
                        </div>
                    </div>
                    {savePrice?.text && (
                        <div className="percent-save-price">
                            Save {savePrice?.percent} %
                        </div>
                    )}
                </>
            ) : (
                <>
                    <div className="price-item-container">
                        <div className="price-section">
                            <span className="sale-price" id="text-save-price">
                                ${salePrice}{" "}
                            </span>
                            {initPrice && (
                                <span className="current-price">
                                    ${initPrice}
                                </span>
                            )}
                        </div>
                        <div className="type">{type}</div>
                        <div className="divide"></div>
                        <div className="average-price">
                            Just <b>${averagePrice} </b>
                            <span className="day">per Day</span>
                        </div>
                        <div className="trial-day">
                            {trialDay && (
                                <>
                                    {trialDay}-days <b>FREE</b> trial
                                </>
                            )}
                        </div>
                    </div>
                    <div className="save-price">
                        {savePrice.text && (
                            <div className="save-price-container">
                                <div className="text">{savePrice?.text}</div>
                                <div className="save-percent">
                                    Save{" "}
                                    <span className="percent">
                                        {savePrice?.percent}
                                    </span>
                                    %
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ItemPrice;
