import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Breakpoint, { BreakpointProvider, setDefaultBreakpoints } from "react-socks";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import IconButton from '@mui/material/IconButton';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import clsx from 'clsx';
import WalletButton from '@components/WalletButton';
import ModeButton from '@components/ModeButton';
import { IsMobile } from '@utils/utils';

setDefaultBreakpoints([
  { xs: 0 },
  { l: 1279 },
  { xl: 1280 }
]);

const ITEM_HEIGHT = 48;

const Header = () => {
  const [anchorEl, setAnchorEl] = useState();
  const location = useLocation();

  const open = Boolean(anchorEl);
  const id = open ? 'popover' : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const header = document.getElementById("myHeader");
    const sticky = header.offsetTop;
    const scrollCallBack = window.addEventListener("scroll", () => {
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
      } else {
        header.classList.remove("sticky");
      }
    });
    return () => {
      window.removeEventListener("scroll", scrollCallBack);
    };
  }, []);

  return (
    <header id="myHeader" className="header container mx-auto top-0 flex items-center justify-between px-4 sm:px-8 py-4 z-[60] transition-all text-white">
      {IsMobile() ?
        <img src="assets/logo.png" width="70" alt="logo" />
        :
        <img src="assets/logo3.png" width="130" alt="logo" />
      }

      <BreakpointProvider>
        <Breakpoint l down>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}>
            <MenuList
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: '20ch',
                },
              }}
            >
              <MenuItem onClick={handleClose}>
                <Link to="/bonding"
                  className={clsx("p-2 font-semibold hover:text-auxi-color duration-200 cursor-pointer whitespace-nowrap",
                    (location?.pathname === '/' || location?.pathname === '/bonding') && "border-opacity-100 text-auxi-color"
                  )}
                >
                  Bond SAM
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link to="/staking"
                  className={clsx("p-2 font-semibold hover:text-auxi-color duration-200 cursor-pointer whitespace-nowrap",
                    location?.pathname === '/staking' && "border-opacity-100 text-auxi-color"
                  )}
                >
                  Stake SAM
                </Link>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <Link to="/referral"
                  className={clsx("p-2 font-semibold hover:text-auxi-color duration-200 cursor-pointer whitespace-nowrap",
                    location?.pathname === "/referral" && "border-opacity-100 text-auxi-color"
                  )}
                >
                  Referral
                </Link>
              </MenuItem>
            </MenuList>
          </Popover>
        </Breakpoint>

        <Breakpoint xl>
          <nav className="nav text-lg">
            <ul className="flex items-center">
              <Link to="/bonding"
                className={clsx("p-4 font-semibold border-b-2 border-auxi-color border-opacity-0 hover:text-auxi-color duration-200 cursor-pointer whitespace-nowrap",
                  (location?.pathname === '/' || location?.pathname === '/bonding') && "border-opacity-100 text-auxi-color"
                )}
              >
                Bond SAM
              </Link>
              <Link to="/staking"
                className={clsx("p-4 font-semibold border-b-2 border-auxi-color border-opacity-0 hover:text-auxi-color duration-200 cursor-pointer whitespace-nowrap",
                  location?.pathname === '/staking' && "border-opacity-100 text-auxi-color"
                )}
              >
                Stake SAM
              </Link>
              <Link to="/referral"
                className={clsx("p-4 font-semibold border-b-2 border-auxi-color border-opacity-0 hover:text-auxi-color duration-200 cursor-pointer whitespace-nowrap",
                  location?.pathname === "/referral" && "border-opacity-100 text-auxi-color"
                )}
              >
                Referral
              </Link>
            </ul>
          </nav>
        </Breakpoint>
      </BreakpointProvider>

      <div className="w-1/2 sm:w-3/12 flex gap-1 sm:gap-3 justify-end items-center">
        <ModeButton />
        <WalletButton />
        <div className='block xl:hidden'>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MenuOpenIcon
              sx={{
                color: 'white',
                fontSize: '32px'
              }}
            />
          </IconButton>
        </div>
      </div>
    </header>
  )
}

export default Header;