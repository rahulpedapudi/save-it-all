import { useEffect, useState } from "react";
import Close from "../assets/Close.svg";
import CloseLight from "../assets/Close_L.svg";

import Logo from "../assets/SaveItLogo.svg";

export default function InitialPage() {
  const [tabInfo, setTabInfo] = useState(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      setTabInfo({ id: tab.id, title: tab.title, url: tab.url });
    });
  }, []);

  return (
    <>
      <nav className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <img width="28px" height="28px" src={Logo} alt="" srcset="" />
          <h2 className="text-xl font-heading">
            Save<span className="font-bold">It</span>
          </h2>
        </div>
        <button
          onClick={() => window.close()}
          type="button"
          aria-label="Close"
          title="Close">
          <i>
            <img src={Close} alt="Close" />
          </i>
        </button>
      </nav>

      <section class="font-body link-info mb-4">
        <h1 id="title-display" class=" page-title text-3xl font-bold mb-2">
          {tabInfo?.title}
        </h1>
        <a
          href=""
          id="url-display"
          class="block w-full hover: underline truncate text-lg text-blue-500 font-bold">
          {tabInfo?.url}
        </a>
        <button
          id="primary-btn"
          class="w-full h-12 mt-4 text-lg rounded-[5px] font-bold bg-saveit-dark text-saveit-light"
          type="button">
          Save Page
        </button>
      </section>

      <section class="font-body tags mb-4">
        <form action="">
          <label class="text-lg font-bold" for="tags">
            Tags
          </label>
          <br />
          <input
            class="border-2 w-full h-10 p-4 text-xs mb-2"
            type="text"
            name="Tags"
            id="Tags"
            placeholder="Add Tags (e.g./ productivity, AI, research)"
          />
        </form>
        <div>
          <ul class="flex">
            <li class="bg-blue-500 text-xs text-white px-3 py-1 rounded-full text-sm mr-1 flex items-center gap-2">
              ai
              <i>
                <img
                  width="14px"
                  height="14px"
                  src={CloseLight}
                  alt=""
                  srcset=""
                />
              </i>
            </li>
          </ul>
        </div>
      </section>

      <section class="note font-body">
        <form action="">
          <label class="text-lg font-bold" for="note">
            Note
          </label>
          <br />
          <input
            class="border-2 w-full text-xs h-full p-4 mb-2"
            type="text"
            name="note"
            id="note"
            placeholder="Add a personal note or context.."
          />
        </form>
      </section>
    </>
  );
}
