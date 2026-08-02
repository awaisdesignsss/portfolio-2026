import { Fragment } from "react";
import { getWordFxStyle } from "./word-fx.utils";
import type { IWordFxProps } from "./word-fx.interface";

/**
 * Per-word hover choreography, declaratively.
 *
 * The old implementation mutated the DOM after mount (`applyWordfx`),
 * splitting `[data-wordfx]` text into `.wordfx` spans. This renders the
 * identical markup straight from JSX — same class, same custom
 * properties — so styles.css keeps driving the hover motion and there
 * is no client-side rewrap step at all.
 */
export default function WordFx({ text, as: Tag = "p", className }: IWordFxProps) {
  const lines = Array.isArray(text) ? text : [text];
  let word = 0;

  return (
    <Tag className={className}>
      {lines.map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {lineIndex > 0 && <br />}
          {line.split(/(\s+)/).map((token, tokenIndex) => {
            if (token === "") return null;
            if (/^\s+$/.test(token)) return <Fragment key={tokenIndex}>{token}</Fragment>;
            return (
              <span key={tokenIndex} className="wordfx" style={getWordFxStyle(word++)}>
                {token}
              </span>
            );
          })}
        </Fragment>
      ))}
    </Tag>
  );
}
