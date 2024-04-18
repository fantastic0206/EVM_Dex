import clsx from 'clsx';

const SelButton = (props) => (
  <button
    className={
      clsx("rounded-full relative inline-flex group items-center justify-center w-24 px-6 py-2 m-1 cursor-pointer overflow-hidden disabled:opacity-30 border border-app-color",
        (props?.active) ? "bg-app-color text-white" : "bg-transparent text-app-color",
        props?.className
      )
    }
    onClick={props?.onClick}
  >
  <span className="relative">{props?.text}</span>
  </button>
)

export default SelButton;