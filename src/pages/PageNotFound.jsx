import React from "react";
import PageNotFoundImg from '../assets/page not found.png';

function PageNotFound() {
  return (
    <>
      <div className="container mt-5">
        <div className="text-center">
          {/* La imagen es ahora responsiva con Bootstrap */}
          <img src={PageNotFoundImg} alt="Page Not Found" className="img-fluid" />
        </div>
      </div>
    </>
  );
}

export default PageNotFound;
