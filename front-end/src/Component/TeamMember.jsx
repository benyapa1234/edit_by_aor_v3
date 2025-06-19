import React from "react";
import { PropTypes } from "prop-types";

const TeamMember = ({ name_th, name_eng, role, image }) => {
  return (
    <div className="p-4 shadow-md rounded-lg text-center">
      <img
        src={image}
        className="mx-auto rounded-full object-cover"
        style={{ maxWidth: "150px", maxHeight: "150px" }}
      />
      <h5 className="mt-4 text-lg font-semibold"style={{ fontSize: "1.2rem" , color: "#333333"  }}>{name_th}</h5>
      <h5 className="mt-3 text-lg font-semibold"style={{ fontSize: "0.8rem", color: "#7C7C7C" }}>{name_eng}</h5>
      <p className="text-gray-600 text-sm"style={{ fontSize: "1rem", color: "#7C7C7C"}}>{role}</p>
    </div>
  );
};

TeamMember.propTypes ={
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
};

export default TeamMember;