import { Link } from "react-router";
import Container from "../layouts/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEnvelopeOpen,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  const today = new Date();
  const year = today.getFullYear();
  return (
    <footer className="bg-[#747474] ">
      <Container>
        <div className="text-white p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <ul>
              <img src="logo_white.png" className="max-w-[10rem] mb-3" />
              <p>
                A Christian community dedicated to sharing faith, encouragement,
                and fellowship.
              </p>
            </ul>

            <ul>
              <h1 className="font-bold text-xl mb-3">Quick Links</h1>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/testimonies">Testimonies</Link>
              </li>
              <li>
                <Link to="/encouragement">Encouragement</Link>
              </li>
              <li>
                <Link to="/community">Community</Link>
              </li>
            </ul>

            <ul>
              <h1 className="font-bold text-xl mb-3">Resources</h1>
              <li>
                <Link to="/">Shop</Link>
              </li>
              <li>
                <Link to="/">Prayer Requests</Link>
              </li>
              <li>
                <Link to="/">Bible Study</Link>
              </li>
              <li>
                <Link to="/">Events</Link>
              </li>
            </ul>

            <ul>
              <h1 className="font-bold text-xl mb-3">Contact</h1>
              <li>
                <Link to="/">
                  <FontAwesomeIcon icon={faEnvelope} /> admin@dailyimmune.org
                </Link>
              </li>
              <li>
                <Link to="/">
                  <FontAwesomeIcon icon={faPhone} /> +263 178 2903
                </Link>
              </li>
              <li>
                <Link to="/">
                  <FontAwesomeIcon icon={faEnvelopeOpen} /> Newsletter
                </Link>
              </li>
            </ul>
          </div>
          <hr className="w-full mt-3" />
          <p className="my-3 text-center">
            &copy; {year} Daily Immune. All Rights Reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
