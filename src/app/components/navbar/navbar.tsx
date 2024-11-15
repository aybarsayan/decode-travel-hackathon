"use client"; // Client component olarak işaretliyoruz

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Disclosure, DisclosureButton } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Home", href: "/", current: false },
  { name: "About", href: "/about", current: false },
  { name: "Team", href: "/team", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [walletId, setWalletId] = useState("");

  useEffect(() => {
    // Çerezden walletId'yi al
    const savedWalletId = Cookies.get("walletAddress");
    if (savedWalletId) {
      setWalletId(savedWalletId);
    }
  }, []);

  const connectWallet = async () => {
    if (!walletId) {
      try {
        // MetaMask üzerinden bağlanma işlemi
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const walletAddress = accounts[0];
        setWalletId(walletAddress);
        Cookies.set("walletAddress", walletAddress, { expires: 7 }); // Wallet ID'yi çereze kaydet

        // Bağlantı işlemi tamamlandıktan sonra sayfayı yenile
        window.location.reload();
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      // Çıkış işlemi: Wallet ID'yi sıfırla ve çerezden kaldır
      setWalletId("");
      Cookies.remove("walletAddress");

      // Çıkış işlemi tamamlandıktan sonra sayfayı yenile
      window.location.reload();
    }
  };

  return (
    <Disclosure as="nav" className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-black hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {walletId ? (
              <a
                type="button"
                href="/profile"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Profile
              </a>
            ) : (
              ""
            )}
            <button
              type="button"
              onClick={connectWallet}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {walletId ? "Exit Wallet" : "Connect Wallet"}
            </button>
          </div>
        </div>
      </div>

      <Disclosure.Panel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={classNames(
                item.current
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                "block rounded-md px-3 py-2 text-base font-medium"
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </Disclosure.Panel>
    </Disclosure>
  );
}
