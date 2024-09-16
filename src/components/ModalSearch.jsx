import React, { useRef, useState, useEffect } from "react";
// import { useDebounce } from "use-lodash-debounce";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// utils
import Transition from "../utils/Transition";
import { fromLocal, toLocal } from "../utils/local";
import config from "../config";

/**
 * ModalSearch
 * @param {object} props - React props
 * @returns {object} React component
 */
function ModalSearch(props) {
  const { id, searchId, modalOpen, setModalOpen } = props;

  const { t } = useTranslation();

  const [value, setValue] = useState();
  // const debouncedValue = useDebounce(value, 800);

  const modalContent = useRef(null);
  const searchInput = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!modalOpen || modalContent.current.contains(target)) return;
      setModalOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!modalOpen || keyCode !== 27) return;
      setModalOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    modalOpen && searchInput.current.focus();
  }, [modalOpen]);

  const [recentSearches, setRecentSearches] = useState([]);
  const [recentPages, setRecentPages] = useState([]);

  useEffect(() => {
    if (modalOpen) {
      setRecentSearches(fromLocal(config.recentSearches, "object") ?? []);
      setRecentPages(fromLocal(config.recentPages, "object") ?? []);
    }
  }, [modalOpen]);

  const saveNewSearch = (content, link) => {
    const oldRecentSearches = recentSearches;
    if (oldRecentSearches.length >= Number(config.recentSearchesLimit))
      recentSearches.splice(Number(config.recentSearchesLimit) - 1);
    const newRecentSearches = [{ link, text: content }, ...recentSearches];
    toLocal(config.recentSearches, newRecentSearches);
  };

  const parseRecentPage = (route) => {
    const [, main, child, secondChild] = route.split("/");

    return (
      <span>
        <span className="font-medium">{t(`_pages:${main}.title`)}</span>
        {" / "}
        <span className="text-slate-600 dark:text-slate-400 group-hover:text-white">
          {t(`_pages:${main}.links.${child}`)}
        </span>
        {secondChild && (
          <>
            {" / "}
            <span className="text-slate-600 dark:text-slate-400 group-hover:text-white">
              {t(`_pages:${child}.${secondChild === "new" ? "editForm" : "newForm"}`)}
            </span>
          </>
        )}
      </span>
    );
  };

  return (
    <>
      {/* Modal backdrop */}
      <Transition
        className="fixed inset-0 bg-slate-900 bg-opacity-30 z-50 transition-opacity"
        show={modalOpen}
        enter="transition ease-out duration-200"
        enterStart="opacity-0"
        enterEnd="opacity-100"
        leave="transition ease-out duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
        aria-hidden="true"
      />
      {/* Modal dialog */}
      <Transition
        id={id}
        className="fixed inset-0 z-50 overflow-hidden flex items-start top-20 mb-4 justify-center px-4 sm:px-6"
        role="dialog"
        aria-modal="true"
        show={modalOpen}
        enter="transition ease-in-out duration-200"
        enterStart="opacity-0 translate-y-4"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in-out duration-200"
        leaveStart="opacity-100 translate-y-0"
        leaveEnd="opacity-0 translate-y-4"
      >
        <div
          ref={modalContent}
          className="bg-white dark:bg-slate-800 border border-transparent dark:border-slate-700 overflow-auto max-w-2xl w-full max-h-full rounded shadow-lg"
        >
          {/* Search form */}
          <form className="border-b border-slate-200 dark:border-slate-700">
            <div className="relative">
              <label htmlFor={searchId} className="sr-only">
                {t("_pages:search.label")}
              </label>
              <input
                id={searchId}
                className="w-full dark:text-slate-300 bg-white dark:bg-slate-800 border-0 focus:ring-transparent placeholder-slate-400 dark:placeholder-slate-500 appearance-none py-3 pl-10 pr-4"
                type="search"
                placeholder={t("_pages:search.placeholder")}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                ref={searchInput}
              />
              <button className="absolute inset-0 right-auto group" type="submit" aria-label="Search">
                <svg
                  className="w-4 h-4 shrink-0 fill-current text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400 ml-4 mr-2"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z" />
                  <path d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z" />
                </svg>
              </button>
            </div>
          </form>
          <div className="py-4 px-2">
            {/* Recent searches */}
            <div className="mb-3 last:mb-0">
              <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase px-2 mb-2">
                <h3>{t("_pages:search.recentSearches")}</h3>
              </div>
              {recentSearches.length ? (
                <ul className="text-sm">
                  {recentSearches.map((search, i) => (
                    <li key={i}>
                      <Link
                        className="flex items-center p-2 text-slate-800 hover:text-white hover:bg-primary rounded group"
                        to={search.link}
                        onClick={() => setModalOpen(!modalOpen)}
                      >
                        <svg
                          className="w-4 h-4 fill-current text-slate-400 dark:text-slate-500 group-hover:text-white group-hover:text-opacity-50 shrink-0 mr-3"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.707 14.293v.001a1 1 0 01-1.414 1.414L11.185 12.6A6.935 6.935 0 017 14a7.016 7.016 0 01-5.173-2.308l-1.537 1.3L0 8l4.873 1.12-1.521 1.285a4.971 4.971 0 008.59-2.835l1.979.454a6.971 6.971 0 01-1.321 3.157l3.107 3.112zM14 6L9.127 4.88l1.521-1.28a4.971 4.971 0 00-8.59 2.83L.084 5.976a6.977 6.977 0 0112.089-3.668l1.537-1.3L14 6z" />
                        </svg>
                        <span>{search.text}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="ml-4 text-sm">{t("_pages:search.noRecentSearches")}</p>
              )}
            </div>
            {/* Recent pages */}
            <div className="mb-3 last:mb-0">
              <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase px-2 mb-2">
                {t("_pages:search.recentPages")}
              </div>
              <ul className="text-sm">
                {recentPages.length ? (
                  <ul className="text-sm">
                    {recentPages.map((page, i) => (
                      <li key={i}>
                        <Link
                          className="flex items-center p-2 text-slate-800 hover:text-white hover:bg-primary rounded group"
                          to={page.link}
                          onClick={() => {
                            saveNewSearch(page.text, page.link);
                            setModalOpen(!modalOpen);
                          }}
                        >
                          <svg
                            className="w-4 h-4 fill-current text-slate-400 dark:text-slate-500 group-hover:text-white group-hover:text-opacity-50 shrink-0 mr-3"
                            viewBox="0 0 16 16"
                          >
                            <path d="M14 0H2c-.6 0-1 .4-1 1v14c0 .6.4 1 1 1h8l5-5V1c0-.6-.4-1-1-1zM3 2h10v8H9v4H3V2z" />
                          </svg>
                          {parseRecentPage(page.link)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="ml-4 text-sm">{t("_pages:search.noRecentPages")}</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
}

export default ModalSearch;
