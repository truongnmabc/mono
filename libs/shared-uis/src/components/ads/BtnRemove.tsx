import RouterApp from "@/constants/router.constant";
import LazyLoadImage from "../images";
import ForwardedLinkBlank from "../nextLink";
import "./index.css";

const BtnRemove = () => {
    return (
        <div className="btn-remove">
            <ForwardedLinkBlank href={RouterApp.Get_pro}>
                <span>Remove ads</span>
                <div className="icon-remove">
                    <LazyLoadImage
                        classNames="w-6 h-6"
                        src="/images/icon-next-remove.svg"
                        alt=""
                    />
                </div>
            </ForwardedLinkBlank>
        </div>
    );
};

export default BtnRemove;
