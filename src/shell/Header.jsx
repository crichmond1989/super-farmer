import React from "react";

/**
 *
 * @param {object} props
 * @param {string} props.address
 */
export default function Header({ address }) {
  return (
    <header>
      <nav className="navbar navbar-dark bg-primary text-white">
        <div className="container">
          <a href="/" className="navbar-brand">
            <img src="/tractor.png" alt="tractor logo" style={{ marginRight: ".5rem", width: 64 }} />
            Super Farmer
          </a>
          <div>
            <div>{address}</div>
          </div>
        </div>
      </nav>
    </header>
  );
}
