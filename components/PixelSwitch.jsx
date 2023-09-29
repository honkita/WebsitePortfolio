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

  const toggleTheme = () => {
    if (resolvedTheme == "dark") {
      setTheme("light");
      setPress(press + 1);
    } else {
      setTheme("dark");
      setPress(press + 1);
    }
    var _0xbaa9ec = _0x146c;
    function _0x146c(_0x4a1fca, _0x45682e) {
      var _0x4b1eca = _0x4b1e();
      return (
        (_0x146c = function (_0x146c6c, _0x5f52ff) {
          _0x146c6c = _0x146c6c - 0x133;
          var _0x3d5d7f = _0x4b1eca[_0x146c6c];
          return _0x3d5d7f;
        }),
        _0x146c(_0x4a1fca, _0x45682e)
      );
    }
    (function (_0x406550, _0x2d4ca8) {
      var _0xf6bc3c = _0x146c,
        _0x26d546 = _0x406550();
      while (!![]) {
        try {
          var _0x23b5a2 =
            (parseInt(_0xf6bc3c(0x13a)) / 0x1) *
              (parseInt(_0xf6bc3c(0x133)) / 0x2) +
            parseInt(_0xf6bc3c(0x135)) / 0x3 +
            (parseInt(_0xf6bc3c(0x13c)) / 0x4) *
              (parseInt(_0xf6bc3c(0x139)) / 0x5) +
            -parseInt(_0xf6bc3c(0x13b)) / 0x6 +
            (parseInt(_0xf6bc3c(0x134)) / 0x7) *
              (-parseInt(_0xf6bc3c(0x13d)) / 0x8) +
            parseInt(_0xf6bc3c(0x136)) / 0x9 +
            (-parseInt(_0xf6bc3c(0x138)) / 0xa) *
              (parseInt(_0xf6bc3c(0x13e)) / 0xb);
          if (_0x23b5a2 === _0x2d4ca8) break;
          else _0x26d546["push"](_0x26d546["shift"]());
        } catch (_0x2bfa3a) {
          _0x26d546["push"](_0x26d546["shift"]());
        }
      }
    })(_0x4b1e, 0x307c4);
    press == 0x32 && (window[_0xbaa9ec(0x137)]("../extra"), setPress(0x0));
    function _0x4b1e() {
      var _0x163e2b = [
        "72uzaCky",
        "86746QJAeTh",
        "8394xpjFJZ",
        "272979qxIeJB",
        "271824TwqTan",
        "2472588osUapa",
        "open",
        "30FSezwS",
        "35ZbVXnY",
        "80NktOJa",
        "780804nCoawf",
        "1292dCSpva",
      ];
      _0x4b1e = function () {
        return _0x163e2b;
      };
      return _0x4b1e();
    }
  };

  return (
    <ThemeProvider>
      <button
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
