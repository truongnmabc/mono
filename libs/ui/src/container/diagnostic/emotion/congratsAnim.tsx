// import { useEffect } from "react";
// declare global {
//     interface Window {
//         confettiful: any;
//     }
// }
// const CongratsAnim = () => {
//     useEffect(() => {
//         if (typeof window !== "undefined") {
//             const Confettiful = function (el) {
//                 this.el = el;
//                 this.containerEl = null;

//                 this.confettiFrequency = 2;
//                 this.confettiColors = [
//                     "#36b0ff",
//                     "#EF2964",
//                     "#00C09D",
//                     "#48485E",
//                     "#EFFF1D",
//                 ];
//                 this.confettiAnimations = ["slow", "medium", "fast"];

//                 this._setupElements();
//                 this._renderConfetti();
//             };

//             Confettiful.prototype._setupElements = function () {
//                 const containerEl = document.createElement("div");
//                 const elPosition = this.el.style.position;

//                 if (elPosition !== "relative" || elPosition !== "absolute") {
//                     this.el.style.position = "relative";
//                 }

//                 containerEl.classList.add("confetti-container");

//                 this.el.appendChild(containerEl);

//                 this.containerEl = containerEl;
//             };

//             Confettiful.prototype._renderConfetti = function () {
//                 this.confettiInterval = setInterval(() => {
//                     const index = Math.floor(
//                         Math.random() * this.confettiColors.length
//                     );
//                     const confettiEl = document.createElement("div");
//                     const confettiBackground = this.confettiColors[index];
//                     const confettiLeft =
//                         Math.floor(Math.random() * this.el.offsetWidth) + "px";
//                     const confettiAnimation =
//                         this.confettiAnimations[
//                             Math.floor(
//                                 Math.random() * this.confettiAnimations.length
//                             )
//                         ];

//                     confettiEl.classList.add(
//                         "confetti",
//                         "confetti--animation-" + confettiAnimation,
//                         "confetti--color-" + index
//                     );
//                     confettiEl.style.left = confettiLeft;
//                     confettiEl.style.width = "5px";
//                     confettiEl.style.borderRadius = "50%";
//                     confettiEl.style.height = "5px";
//                     confettiEl.style.backgroundColor = "none";

//                     if (index == 2 || index == 4 || index == 3) {
//                         confettiEl.style.display = "none";
//                     }
//                     if (index == 0) {
//                         confettiEl.style.backgroundColor = confettiBackground;
//                     }
//                     setTimeout(function () {
//                         confettiEl?.parentNode?.removeChild(confettiEl);
//                     }, 2000);

//                     this.containerEl.appendChild(confettiEl);
//                 }, 30);
//             };

//             window.confettiful = new Confettiful(
//                 document.querySelector(".js-container")
//             );
//         }
//     }, []);
//     return (
//         <div
//             className="js-container container"
//             style={{ top: "0px !important" }}
//         ></div>
//     );
// };

// export default CongratsAnim;
