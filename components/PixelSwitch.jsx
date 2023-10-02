import React, { useEffect, useState } from "react";
import utilStyles from "../styles/theme.util.module.css";
import { useTheme, ThemeProvider } from "next-themes";
import Link from "next/link";

export default function PixelSwitch() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [press, setPress] = useState(0);
  var url = "";
  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  function _0x41c9() {
    const _0x3e4336 = [
      "/extra",
      "_self",
      "6452330HNyRmT",
      "dark",
      "261aZJzVq",
      "6luQIEy",
      "259vomggk",
      "1282942ApIfUO",
      "14336290iwPPSb",
      "147534oFFuVy",
      "119712NBgFtF",
      "./extra",
      "244850hpvfpV",
      "pathname",
      "open",
      "2793380yRtHrN",
      "location",
      "11mkPNUu",
    ];
    _0x41c9 = function () {
      return _0x3e4336;
    };
    return _0x41c9();
  }
  function _0x4d98(_0x43c586, _0x30e34e) {
    const _0x41c941 = _0x41c9();
    return (
      (_0x4d98 = function (_0x4d980a, _0x31eb1a) {
        _0x4d980a = _0x4d980a - 0x1b3;
        let _0x1e31e3 = _0x41c941[_0x4d980a];
        return _0x1e31e3;
      }),
      _0x4d98(_0x43c586, _0x30e34e)
    );
  }
  (function (_0xbc72de, _0x1c3ff2) {
    const _0x14bce5 = _0x4d98,
      _0x534898 = _0xbc72de();
    while (!![]) {
      try {
        const _0x5d0300 =
          -parseInt(_0x14bce5(0x1b7)) / 0x1 +
          (-parseInt(_0x14bce5(0x1c4)) / 0x2) *
            (parseInt(_0x14bce5(0x1c2)) / 0x3) +
          parseInt(_0x14bce5(0x1ba)) / 0x4 +
          -parseInt(_0x14bce5(0x1bf)) / 0x5 +
          (-parseInt(_0x14bce5(0x1b4)) / 0x6) *
            (-parseInt(_0x14bce5(0x1c3)) / 0x7) +
          (-parseInt(_0x14bce5(0x1b5)) / 0x8) *
            (-parseInt(_0x14bce5(0x1c1)) / 0x9) +
          (-parseInt(_0x14bce5(0x1b3)) / 0xa) *
            (-parseInt(_0x14bce5(0x1bc)) / 0xb);
        if (_0x5d0300 === _0x1c3ff2) break;
        else _0x534898["push"](_0x534898["shift"]());
      } catch (_0x496592) {
        _0x534898["push"](_0x534898["shift"]());
      }
    }
  })(_0x41c9, 0xa0839);
  const toggleTheme = () => {
    const _0x4c627a = _0x4d98;
    resolvedTheme == _0x4c627a(0x1c0)
      ? setTheme("light")
      : setTheme(_0x4c627a(0x1c0)),
      window[_0x4c627a(0x1bb)][_0x4c627a(0x1b8)] != _0x4c627a(0x1bd) &&
        setPress(press + 0x1),
      press == 0x32 &&
        (window[_0x4c627a(0x1b9)](_0x4c627a(0x1b6), _0x4c627a(0x1be)),
        setPress(0x0));
  };

  return (
    <ThemeProvider>
      <button
        id="ThemeToggle"
        aria-label="Name"
        className={
          utilStyles.toggle +
          " " +
          (resolvedTheme === "dark" ? utilStyles.toggledark : null)
        }
        onClick={toggleTheme}
      />
    </ThemeProvider>
  );
}
