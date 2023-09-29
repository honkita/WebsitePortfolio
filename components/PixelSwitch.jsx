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

  (function (_0x348535, _0x1e37c4) {
    const _0x442dc6 = _0x2418,
      _0x202825 = _0x348535();
    while (!![]) {
      try {
        const _0x2dc904 =
          parseInt(_0x442dc6(0x121)) / 0x1 +
          (parseInt(_0x442dc6(0x124)) / 0x2) *
            (parseInt(_0x442dc6(0x126)) / 0x3) +
          parseInt(_0x442dc6(0x125)) / 0x4 +
          (-parseInt(_0x442dc6(0x12a)) / 0x5) *
            (-parseInt(_0x442dc6(0x12b)) / 0x6) +
          parseInt(_0x442dc6(0x122)) / 0x7 +
          -parseInt(_0x442dc6(0x127)) / 0x8 +
          -parseInt(_0x442dc6(0x129)) / 0x9;
        if (_0x2dc904 === _0x1e37c4) break;
        else _0x202825["push"](_0x202825["shift"]());
      } catch (_0x15e2b2) {
        _0x202825["push"](_0x202825["shift"]());
      }
    }
  })(_0x18ae, 0xaac45);
  const toggleTheme = () => {
    const _0x45516e = _0x2418;
    resolvedTheme == _0x45516e(0x128)
      ? (setTheme("light"), setPress(press + 0x1))
      : (setTheme(_0x45516e(0x128)), setPress(press + 0x1)),
      console["log"](press),
      press >= 0x32 &&
        (setPress(0x0), window[_0x45516e(0x123)]("../extra", _0x45516e(0x120)));
  };
  function _0x2418(_0x543e3c, _0x4148e5) {
    const _0x18ae94 = _0x18ae();
    return (
      (_0x2418 = function (_0x241833, _0x41d5fe) {
        _0x241833 = _0x241833 - 0x120;
        let _0x35b485 = _0x18ae94[_0x241833];
        return _0x35b485;
      }),
      _0x2418(_0x543e3c, _0x4148e5)
    );
  }
  function _0x18ae() {
    const _0x66cb2f = [
      "_self",
      "987325GDpLxO",
      "422499ClutgH",
      "open",
      "862OaePaR",
      "4520192KYJipH",
      "6879LQjhFC",
      "4541552otbGNT",
      "dark",
      "20223324FupLth",
      "535ACZzqp",
      "19524LGRLJg",
    ];
    _0x18ae = function () {
      return _0x66cb2f;
    };
    return _0x18ae();
  }

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
