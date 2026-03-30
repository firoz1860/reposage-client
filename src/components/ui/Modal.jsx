import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

function Modal({ isOpen, onClose, title, description, children }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl dark:border-white/10 dark:bg-[#07111f] dark:text-white">
                <Dialog.Title className="text-xl font-semibold">{title}</Dialog.Title>
                {description ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
                <div className="mt-6">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;
