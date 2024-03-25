import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Notification
 * @param {object} props - Props
 * @returns {object} React component
 */
function Notification(props) {
  const { t } = useTranslation();

  const { notification } = props;

  const [notificationOpen, setNotificationOpen] = useState(Boolean(notification.length));
  const [state, setState] = useState("");
  const [notificationClass, setNotificationClass] = useState("");

  useEffect(() => {
    setNotificationOpen(Boolean(notification.length));
    switch (notification) {
      case "400":
      case "401":
        return setState("bad");
      case "500":
        return setState("ugly");
      case "200":
      case "201":
        return setState("good");
      default:
        return setState("");
    }
  }, [notification]);

  useEffect(() => {
    const lNotificationClasses = {
      good: "bg-green-500",
      bad: "bg-red-500",
      ugly: "bg-red-500",
    };
    setNotificationClass(lNotificationClasses[state]);
  }, [state]);

  return (
    <>
      {
        <div
          className={`${notificationOpen ? "opacity-1 scale-100" : "pointer-events-none opacity-0"} transition-all fixed bottom-0 right-0 w-full md:bottom-8 md:right-12 md:w-auto z-50`}
        >
          <div
            className={`${notificationClass} border border-transparent dark:border-slate-700 text-white text-sm p-3 md:rounded shadow-lg flex justify-between`}
          >
            <div className={`text-white inline-flex`}>
              {t(`_accessibility:messages.${notification}`)}
            </div>
            <button
              className="text-white hover:text-[red] pl-2 ml-3 border-l border-slate-200"
              onClick={() => setNotificationOpen(false)}
            >
              <span className="sr-only">{t("_accessibility:buttons.close")}</span>
              <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 16 16">
                <path d="M12.72 3.293a1 1 0 00-1.415 0L8.012 6.586 4.72 3.293a1 1 0 00-1.414 1.414L6.598 8l-3.293 3.293a1 1 0 101.414 1.414l3.293-3.293 3.293 3.293a1 1 0 001.414-1.414L9.426 8l3.293-3.293a1 1 0 000-1.414z" />
              </svg>
            </button>
          </div>
        </div>
      }
    </>
  );
}

export default Notification;
