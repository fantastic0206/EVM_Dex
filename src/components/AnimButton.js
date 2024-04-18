import clsx from 'clsx';

const AnimButton = (props) => (
  <button
    className={
      clsx("rounded-full relative inline-flex group items-center justify-center px-3.5 py-2 m-1 cursor-pointer overflow-hidden disabled:opacity-30 border border-app-color",
        (props?.active || props?.disabled) ? "bg-main-gradient border-none text-white" : "bg-transparent dark:text-white",
        props?.disabled && "dark:bg-none dark:bg-[#1E2B58]",
        props?.className
      )
    }

    onClick={props?.onClick}
    disabled={props?.disabled}
  >
    {(!props?.active && !props?.disabled) ? (
      <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-app-color rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
    ) : !props?.disabled && (
      <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
    )}
    <span className="relative">{props?.text}</span>
  </button>
)

export default AnimButton;