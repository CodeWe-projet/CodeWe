// Those regex are based on https://github.com/ccampbell/rainbow/tree/master/src/language made by Craig Campbell
// Big love to them <3
// For oz it's base on vscode extension : https://github.com/mozart/vscode-oz/blob/master/syntaxes/oz.tmLanguage.json

export const patterns = {
    generic: [
        {
            matches: {
                1: [
                    {
                        name: 'keyword.operator',
                        pattern: /\=|\+/g
                    },
                    {
                        name: 'keyword.dot',
                        pattern: /\./g
                    }
                ],
                2: {
                    name: 'string',
                    matches: {
                        name: 'constant.character.escape',
                        pattern: /\\('|"){1}/g
                    }
                }
            },
            pattern: /(\(|\s|\[|\=|:|\+|\.|\{|,)(('|")([^\\\1]|\\.)*?(\3))/gm
        },
        {
            name: 'comment',
            pattern: /\/\*[\s\S]*?\*\/|(\/\/|\#)(?!.*('|").*?[^:](\/\/|\#)).*?$/gm
        },
        {
            name: 'constant.numeric',
            pattern: /\b(\d+(\.\d+)?(e(\+|\-)?\d+)?(f|d)?|0x[\da-f]+)\b/gi
        },
        {
            matches: {
                1: 'keyword'
            },
            pattern: /\b(and|array|as|b(ool(ean)?|reak)|c(ase|atch|har|lass|on(st|tinue))|d(ef|elete|o(uble)?)|e(cho|lse(if)?|xit|xtends|xcept)|f(inally|loat|or(each)?|unction)|global|if|import|int(eger)?|long|new|object|or|pr(int|ivate|otected)|public|return|self|st(ring|ruct|atic)|switch|th(en|is|row)|try|(un)?signed|var|void|while)(?=\b)/gi
        },
        {
            name: 'constant.language',
            pattern: /true|false|null/g
        },
        {
            name: 'keyword.operator',
            pattern: /\+|\!|\-|&(gt|lt|amp);|\||\*|\=/g
        },
        {
            matches: {
                1: 'function.call'
            },
            pattern: /(\w+?)(?=\()/g
        },
        {
            matches: {
                1: 'storage.function',
                2: 'entity.name.function'
            },
            pattern: /(function)\s(.*?)(?=\()/g
        }
    ],
    python: [
        /**
         * don't highlight self as a keyword
         */
        {
            name: 'variable.self',
            pattern: /self/g
        },
        {
            name: 'constant.language',
            pattern: /None|True|False|NotImplemented|\.\.\./g
        },
        {
            name: 'support.object',
            pattern: /object/g
        },

        /**
         * built in python functions
         *
         * this entire list is 580 bytes minified / 379 bytes gzipped
         *
         * @see http://docs.python.org/library/functions.html
         *
         * @todo strip some out or consolidate the regexes with matching patterns?
         */
        {
            name: 'support.function.python',
            pattern: /\b(bs|divmod|input|open|staticmethod|all|enumerate|int|ord|str|any|eval|isinstance|pow|sum|basestring|execfile|issubclass|print|super|bin|file|iter|property|tuple|bool|filter|len|range|type|bytearray|float|list|raw_input|unichr|callable|format|locals|reduce|unicode|chr|frozenset|long|reload|vars|classmethod|getattr|map|repr|xrange|cmp|globals|max|reversed|zip|compile|hasattr|memoryview|round|__import__|complex|hash|min|set|apply|delattr|help|next|setattr|buffer|dict|hex|object|slice|coerce|dir|id|oct|sorted|intern)(?=\()/g
        },
        {
            matches: {
                1: 'keyword'
            },
            pattern: /\b(pass|lambda|with|is|not|in|from|elif|raise|del)(?=\b)/g
        },
        {
            matches: {
                1: 'storage.class',
                2: 'entity.name.class',
                3: 'entity.other.inherited-class'
            },
            pattern: /(class)\s+(\w+)\((\w+?)\)/g
        },
        {
            matches: {
                1: 'storage.function',
                2: 'support.magic'
            },
            pattern: /(def)\s+(__\w+)(?=\()/g
        },
        {
            name: 'support.magic',
            pattern: /__(name)__/g
        },
        {
            matches: {
                1: 'keyword.control',
                2: 'support.exception.type'
            },
            pattern: /(except) (\w+):/g
        },
        {
            matches: {
                1: 'storage.function',
                2: 'entity.name.function'
            },
            pattern: /(def)\s+(\w+)(?=\()/g
        },
        {
            name: 'entity.name.function.decorator',
            pattern: /@([\w\.]+)/g
        },
        {
            name: 'comment.docstring',
            pattern: /('{3}|"{3})[\s\S]*?\1/gm
        }
    ],
    javascript: [

        /**
         * matches $. or $(
         */
        {
            name: 'selector',
            pattern: /\$(?=\.|\()/g
        },
        {
            name: 'support',
            pattern: /\b(window|document)\b/g
        },
        {
            name: 'keyword',
            pattern: /\b(export|default|from)\b/g
        },
        {
            name: 'function.call',
            pattern: /\b(then)(?=\()/g
        },
        {
            name: 'variable.language.this',
            pattern: /\bthis\b/g
        },
        {
            name: 'variable.language.super',
            pattern: /super(?=\.|\()/g
        },
        {
            name: 'storage.type',
            pattern: /\b(const|let|var)(?=\s)/g
        },
        {
            matches: {
                1: 'support.property'
            },
            pattern: /\.(length|node(Name|Value))\b/g
        },
        {
            matches: {
                1: 'support.function'
            },
            pattern: /(setTimeout|setInterval)(?=\()/g
        },
        {
            matches: {
                1: 'support.method'
            },
            pattern: /\.(getAttribute|replace|push|getElementById|getElementsByClassName|setTimeout|setInterval)(?=\()/g
        },

        /**
         * matches any escaped characters inside of a js regex pattern
         *
         * @see https://github.com/ccampbell/rainbow/issues/22
         *
         * this was causing single line comments to fail so it now makes sure
         * the opening / is not directly followed by a *
         *
         * The body of the regex to match a regex was borrowed from:
         * http://stackoverflow.com/a/17843773/421333
         */
        {
            name: 'string.regexp',
            matches: {
                1: 'string.regexp.open',
                2: {
                    name: 'constant.regexp.escape',
                    pattern: /\\(.){1}/g
                },
                3: 'string.regexp.close',
                4: 'string.regexp.modifier'
            },
            pattern: /(\/)((?![*+?])(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+)(\/)(?!\/)([igm]{0,3})/g
        },

        /**
         * matches runtime function declarations
         */
        {
            matches: {
                1: 'storage.type',
                3: 'entity.function'
            },
            pattern: /(var)?(\s|^)(\S+)(?=\s?=\s?function\()/g
        },

        /**
         * matches constructor call
         */
        {
            matches: {
                1: 'keyword',
                2: 'variable.type'
            },
            pattern: /(new)\s+(?!Promise)([^\(]*)(?=\()/g
        },

        /**
         * matches any function call in the style functionName: function()
         */
        {
            name: 'entity.function',
            pattern: /(\w+)(?=:\s{0,}function)/g
        },
        {
            name: 'constant.other',
            pattern: /\*(?= as)/g
        },
        {
            matches: {
                1: 'keyword',
                2: 'constant.other'
            },
            pattern: /(export)\s+(\*)/g
        },
        {
            matches: {
                1: 'storage.type.accessor',
                2: 'entity.name.function'
            },
            pattern: /(get|set)\s+(\w+)(?=\()/g
        },
        {
            matches: {
                2: 'entity.name.function'
            },
            pattern: /(^\s*)(\w+)(?=\([^\)]*?\)\s*\{)/gm
        },
        {
            matches: {
                1: 'storage.type.class',
                2: 'entity.name.class',
                3: 'storage.modifier.extends',
                4: 'entity.other.inherited-class'
            },
            pattern: /(class)\s+(\w+)(?:\s+(extends)\s+(\w+))?(?=\s*\{)/g
        },
        {
            name: 'storage.type.function.arrow',
            pattern: /=&gt;/g
        },
        {
            name: 'support.class.promise',
            pattern: /\bPromise(?=(\(|\.))/g
        }
    ],
    java: [
        {
          name: "constant",
          pattern: /\b(false|null|true|[A-Z_]+)\b/g
        },
        {
          matches: {
            1: "keyword",
            2: "support.namespace"
          },
          pattern: /(import|package)\s(.+)/g
        },
        {
          // see http://docs.oracle.com/javase/tutorial/java/nutsandbolts/_keywords.html
          name: "keyword",
          pattern: /\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while)\b/g
        },
        {
          name: "string",
          pattern: /(".*?")/g
        },
        {
          name: "char",
          pattern: /(')(.|\\.|\\u[\dA-Fa-f]{4})\1/g
        },
        {
          name: "integer",
          pattern: /\b(0x[\da-f]+|\d+)L?\b/g
        },
        {
          name: "comment",
          pattern: /\/\*[\s\S]*?\*\/|(\/\/).*?$/gm
        },
        {
          name: "support.annotation",
          pattern: /@\w+/g
        },
        {
          matches: {
            1: "entity.function"
          },
          pattern: /([^@\.\s]+)\(/g
        },
        {
          name: "entity.class",
          pattern: /\b([A-Z]\w*)\b/g
        },
        {
          // see http://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html
          name: "operator",
          pattern: /(\+{1,2}|-{1,2}|~|!|\*|\/|%|(?:&lt;){1,2}|(?:&gt;){1,3}|instanceof|(?:&amp;){1,2}|\^|\|{1,2}|\?|:|(?:=|!|\+|-|\*|\/|%|\^|\||(?:&lt;){1,2}|(?:&gt;){1,3})?=)/g
        }
      ],
      c: [
        {
            name: 'meta.preprocessor',
            matches: {
                1: [
                    {
                        matches: {
                            1: 'keyword.define',
                            2: 'entity.name'
                        },
                        pattern: /(\w+)\s(\w+)\b/g
                    },
                    {
                        name: 'keyword.define',
                        pattern: /endif/g
                    },
                    {
                        name: 'constant.numeric',
                        pattern: /\d+/g
                    },
                    {
                        matches: {
                            1: 'keyword.include',
                            2: 'string'
                        },
                        pattern: /(include)\s(.*?)$/g
                    }
                ]
            },
            pattern: /\#([\S\s]*?)$/gm
        },
        {
            name: 'keyword',
            pattern: /\b(do|goto|typedef)\b/g
        },
        {
            name: 'entity.label',
            pattern: /\w+:/g
        },
        {
            matches: {
                1: 'storage.type',
                3: 'storage.type',
                4: 'entity.name.function'
            },
            pattern: /\b((un)?signed|const)? ?(void|char|short|int|long|float|double)\*? +((\w+)(?= ?\())?/g
        },
        {
            matches: {
                2: 'entity.name.function'
            },
            pattern: /(\w|\*) +((\w+)(?= ?\())/g
        },
        {
            name: 'storage.modifier',
            pattern: /\b(static|extern|auto|register|volatile|inline)\b/g
        },
        {
            name: 'support.type',
            pattern: /\b(struct|union|enum)\b/g
        }
    ],
    coffescript: [
        {
            name: 'comment.block',
            pattern: /(\#{3})[\s\S]*\1/gm
        },
        {
            name: 'string.block',
            pattern: /('{3}|"{3})[\s\S]*\1/gm
        },

        /**
         * multiline regex with comments
         */
        {
            name: 'string.regex',
            matches: {
                2: {
                    name: 'comment',
                    pattern: /\#(.*?)(?=\n)/g
                }
            },
            pattern: /(\/{3})([\s\S]*)\1/gm
        },
        {
            matches: {
                1: 'keyword'
            },
            pattern: /\b(in|when|is|isnt|of|not|unless|until|super)(?=\b)/gi
        },
        {
            name: 'keyword.operator',
            pattern: /\?/g
        },
        {
            name: 'constant.language',
            pattern: /\b(undefined|yes|on|no|off)\b/g
        },
        {
            name: 'keyword.variable.coffee',
            pattern: /@(\w+)/gi
        },

        /**
         * reset global keywards from generic
         */
        {
            name: 'reset',
            pattern: /object|class|print/gi
        },

        /**
         * named function
         */
        {
            'matches' : {
                1: 'entity.name.function',
                2: 'keyword.operator',
                3: {
                        name: 'function.argument.coffee',
                        pattern: /([\@\w]+)/g
                },
                4: 'keyword.function'
            },
            pattern: /(\w+)\s{0,}(=|:)\s{0,}\((.*?)((-|=)&gt;)/gi
        },

        /**
         * anonymous function
         */
        {
            matches: {
                1: {
                        name: 'function.argument.coffee',
                        pattern: /([\@\w]+)/g
                },
                2: 'keyword.function'
            },
            pattern: /\s\((.*?)\)\s{0,}((-|=)&gt;)/gi
        },

        /**
         * direct function no arguments
         */
        {
            'matches' : {
                1: 'entity.name.function',
                2: 'keyword.operator',
                3: 'keyword.function'
            },
            pattern: /(\w+)\s{0,}(=|:)\s{0,}((-|=)&gt;)/gi
        },

        /**
         * class definitions
         */
        {
            matches: {
                1: 'storage.class',
                2: 'entity.name.class',
                3: 'storage.modifier.extends',
                4: 'entity.other.inherited-class'
            },
            pattern: /\b(class)\s(\w+)(\sextends\s)?([\w\\]*)?\b/g
        },

        /**
         * object instantiation
         */
        {
            matches: {
                1: 'keyword.new',
                2: {
                    name: 'support.class',
                    pattern: /\w+/g
                }
            },
            pattern: /\b(new)\s(.*?)(?=\s)/g
        }
    ],
    'c#': [
        {
            // @see http://msdn.microsoft.com/en-us/library/23954zh5.aspx
            name: 'constant',
            pattern: /\b(false|null|true)\b/g
        },
        {
            // @see http://msdn.microsoft.com/en-us/library/x53a06bb%28v=vs.100%29.aspx
            // Does not support putting an @ in front of a keyword which makes it not a keyword anymore.
            name: 'keyword',
            pattern: /\b(abstract|add|alias|ascending|as|async|await|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|descending|double|do|dynamic|else|enum|event|explicit|extern|false|finally|fixed|float|foreach|for|from|get|global|goto|group|if|implicit|int|interface|internal|into|in|is|join|let|lock|long|namespace|new|object|operator|orderby|out|override|params|partial|private|protected|public|readonly|ref|remove|return|sbyte|sealed|select|set|short|sizeof|stackalloc|static|string|struct|switch|this|throw|try|typeof|uint|unchecked|ulong|unsafe|ushort|using|value|var|virtual|void|volatile|where|while|yield)\b/g
        },
        {
            matches: {
                1: 'keyword',
                2: {
                    name: 'support.class',
                    pattern: /\w+/g
                }
            },
            pattern: /(typeof)\s([^\$].*?)(\)|;)/g
        },
        {
            matches: {
                1: 'keyword.namespace',
                2: {
                    name: 'support.namespace',
                    pattern: /\w+/g
                }
            },
            pattern: /\b(namespace)\s(.*?);/g
        },
        {
            matches: {
                1: 'storage.modifier',
                2: 'storage.class',
                3: 'entity.name.class',
                4: 'storage.modifier.extends',
                5: 'entity.other.inherited-class'
            },
            pattern: /\b(abstract|sealed)?\s?(class)\s(\w+)(\sextends\s)?([\w\\]*)?\s?\{?(\n|\})/g
        },
        {
            name: 'keyword.static',
            pattern: /\b(static)\b/g
        },
        {
            matches: {
                1: 'keyword.new',
                2: {
                    name: 'support.class',
                    pattern: /\w+/g
                }

            },
            pattern: /\b(new)\s([^\$].*?)(?=\)|\(|;|&)/g
        },
        {
            name: 'string',
            pattern: /(")(.*?)\1/g
        },
        {
            name: 'integer',
            pattern: /\b(0x[\da-f]+|\d+)\b/g
        },
        {
            name: 'comment',
            pattern: /\/\*[\s\S]*?\*\/|(\/\/)[\s\S]*?$/gm
        },
        {
            name: 'operator',
            // @see http://msdn.microsoft.com/en-us/library/6a71f45d%28v=vs.100%29.aspx
            // ++ += + -- -= - <<= << <= => >>= >> >= != ! ~ ^ || && &= & ?? :: : *= * |= %= |= == =
            pattern: /(\+\+|\+=|\+|--|-=|-|&lt;&lt;=|&lt;&lt;|&lt;=|=&gt;|&gt;&gt;=|&gt;&gt;|&gt;=|!=|!|~|\^|\|\||&amp;&amp;|&amp;=|&amp;|\?\?|::|:|\*=|\*|\/=|%=|\|=|==|=)/g
        },
        {
            // @see http://msdn.microsoft.com/en-us/library/ed8yd1ha%28v=vs.100%29.aspx
            name: 'preprocessor',
            pattern: /(\#if|\#else|\#elif|\#endif|\#define|\#undef|\#warning|\#error|\#line|\#region|\#endregion|\#pragma)[\s\S]*?$/gm
        }
    ],
    css: [
        {
            name: 'comment',
            pattern: /\/\*[\s\S]*?\*\//gm
        },
        {
            name: 'constant.hex-color',
            pattern: /#([a-f0-9]{3}|[a-f0-9]{6})(?=;|\s|,|\))/gi
        },
        {
            matches: {
                1: 'constant.numeric',
                2: 'keyword.unit'
            },
            pattern: /(\d+)(px|em|cm|s|%)?/g
        },
        {
            name: 'string',
            pattern: /('|")(.*?)\1/g
        },
        {
            name: 'support.css-property',
            matches: {
                1: 'support.vendor-prefix'
            },
            pattern: /(-o-|-moz-|-webkit-|-ms-)?[\w-]+(?=\s?:)(?!.*\{)/g
        },
        {
            matches: {
                1: [
                    {
                        name: 'entity.name.sass',
                        pattern: /&amp;/g
                    },
                    {
                        name: 'direct-descendant',
                        pattern: /&gt;/g
                    },
                    {
                        name: 'entity.name.class',
                        pattern: /\.[\w\-_]+/g
                    },
                    {
                        name: 'entity.name.id',
                        pattern: /\#[\w\-_]+/g
                    },
                    {
                        name: 'entity.name.pseudo',
                        pattern: /:[\w\-_]+/g
                    },
                    {
                        name: 'entity.name.tag',
                        pattern: /\w+/g
                    }
                ]
            },
            pattern: /([\w\ ,\n:\.\#\&\;\-_]+)(?=.*\{)/g
        },
        {
            matches: {
                2: 'support.vendor-prefix',
                3: 'support.css-value'
            },
            pattern: /(:|,)\s*(-o-|-moz-|-webkit-|-ms-)?([a-zA-Z-]*)(?=\b)(?!.*\{)/g
        }
    ],
    go: [
        {
            matches: {
                1: [
                    {
                        name: 'keyword.operator',
                        pattern: /\=|\+/g
                    }
                ],
                2: {
                    name: 'string',
                    matches: {
                        name: 'constant.character.escape',
                        pattern: /\\(`|"){1}/g
                    }
                }
            },
            pattern: /(\(|\s|\[|\=|:|\+|\{|,)((`|")([^\\\1]|\\.)*?(\3))/gm
        },
        {
            name: 'comment',
            pattern: /\/\*[\s\S]*?\*\/|(\/\/)(?!.*(`|").*?\1).*?$/gm
        },
        {
            matches: {
                1: 'keyword'
            },
            pattern: /\b(d(efault|efer)|fallthrough|go(to)?|range|select)(?=\b)/gi
        },
        {
            name: 'keyword',
            pattern: /\bpackage(?=\s*\w)/gi
        },
        {
            matches: {
                1: 'storage.type',
                2: 'entity.name.struct'
            },
            pattern: /\b(type)\s+(\w+)\b(?=\s+struct\b)/gi
        },
        {
            matches: {
                1: 'storage.type',
                2: 'entity.name.type'
            },
            pattern: /\b(type)\s+(\w+)\b/gi
        },
        {
            name: 'storage.type',
            pattern: /\b(bool|byte|complex(64|128)|float(32|64)|func|interface|map|rune|string|struct|u?int(8|16|32|64)?|var)(?=\b)/g
        },
        {
            name: 'keyword.operator.initialize',
            pattern: /\:=/g
        },
        {
            matches: {
                1: 'storage.function',
                2: 'entity.name.function'
            },
            pattern: /(func)\s+(?:\(.*?\))\s+(.*?)(?=\()/g
        },
        {
            matches: {
                1: 'storage.function',
                2: 'entity.name.function'
            },
            pattern: /(func)\s+(.*?)(?=\()/g
        }
    ],
    html : [
        {
            name: 'source.php.embedded',
            matches: {
                1: 'variable.language.php-tag',
                2: {
                    language: 'php'
                },
                3: 'variable.language.php-tag'
            },
            pattern: /(&lt;\?php|&lt;\?=?(?!xml))([\s\S]*?)(\?&gt;)/gm
        },
        {
            name: 'source.css.embedded',
            matches: {
                1: {
                    matches: {
                        1: 'support.tag.style',
                        2: [
                            {
                                name: 'entity.tag.style',
                                pattern: /^style/g
                            },
                            {
                                name: 'string',
                                pattern: /('|")(.*?)(\1)/g
                            },
                            {
                                name: 'entity.tag.style.attribute',
                                pattern: /(\w+)/g
                            }
                        ],
                        3: 'support.tag.style'
                    },
                    pattern: /(&lt;\/?)(style.*?)(&gt;)/g
                },
                2: {
                    language: 'css'
                },
                3: 'support.tag.style',
                4: 'entity.tag.style',
                5: 'support.tag.style'
            },
            pattern: /(&lt;style.*?&gt;)([\s\S]*?)(&lt;\/)(style)(&gt;)/gm
        },
        {
            name: 'source.js.embedded',
            matches: {
                1: {
                    matches: {
                        1: 'support.tag.script',
                        2: [
                            {
                                name: 'entity.tag.script',
                                pattern: /^script/g
                            },

                            {
                                name: 'string',
                                pattern: /('|")(.*?)(\1)/g
                            },
                            {
                                name: 'entity.tag.script.attribute',
                                pattern: /(\w+)/g
                            }
                        ],
                        3: 'support.tag.script'
                    },
                    pattern: /(&lt;\/?)(script.*?)(&gt;)/g
                },
                2: {
                    language: 'javascript'
                },
                3: 'support.tag.script',
                4: 'entity.tag.script',
                5: 'support.tag.script'
            },
            pattern: /(&lt;script(?! src).*?&gt;)([\s\S]*?)(&lt;\/)(script)(&gt;)/gm
        },
        {
            name: 'comment.html',
            pattern: /&lt;\!--[\S\s]*?--&gt;/g
        },
        {
            matches: {
                1: 'support.tag.open',
                2: 'support.tag.close'
            },
            pattern: /(&lt;)|(\/?\??&gt;)/g
        },
        {
            name: 'support.tag',
            matches: {
                1: 'support.tag',
                2: 'support.tag.special',
                3: 'support.tag-name'
            },
            pattern: /(&lt;\??)(\/|\!?)(\w+)/g
        },
        {
            matches: {
                1: 'support.attribute'
            },
            pattern: /([a-z-]+)(?=\=)/gi
        },
        {
            matches: {
                1: 'support.operator',
                2: 'string.quote',
                3: 'string.value',
                4: 'string.quote'
            },
            pattern: /(=)('|")(.*?)(\2)/g
        },
        {
            matches: {
                1: 'support.operator',
                2: 'support.value'
            },
            pattern: /(=)([a-zA-Z\-0-9]*)\b/g
        },
        {
            matches: {
                1: 'support.attribute'
            },
            pattern: /\s([\w-]+)(?=\s|&gt;)(?![\s\S]*&lt;)/g
        }
    ],
    json : [
        {
            matches: {
                0: {
                    name: 'string',
                    matches: {
                        name: 'constant.character.escape',
                        pattern: /\\('|"){1}/g
                    }
                }
            },
            pattern: /(\"|\')(\\?.)*?\1/g
        },
        {
            name: 'constant.numeric',
            pattern: /\b(-?(0x)?\d*\.?[\da-f]+|NaN|-?Infinity)\b/gi
        },
        {
            name: 'constant.language',
            pattern: /\b(true|false|null)\b/g
        }
    ],
    lua: [
        {
            matches: {
                1: {
                    name: 'keyword.operator',
                    pattern: /\=/g
                },
                2: {
                    name: 'string',
                    matches: {
                        name: 'constant.character.escape',
                        pattern: /\\('|"){1}/g
                    }
                }
            },
            pattern: /(\(|\s|\[|\=)(('|")([^\\\1]|\\.)*?(\3))/gm
        },
        {
            name: 'comment',
            pattern: /\-{2}\[{2}\-{2}[\s\S]*?\-{2}\]{2}\-{2}|(\-{2})[\s\S]*?$/gm
        },
        {
            name: 'constant.numeric',
            pattern: /\b(\d+(\.\d+)?(e(\+|\-)?\d+)?(f|d)?|0x[\da-f]+)\b/gi
        },
        {
            matches: {
                1: 'keyword'
            },
            pattern: /\b((a|e)nd|in|repeat|break|local|return|do|for|then|else(if)?|function|not|if|or|until|while)(?=\b)/gi
        },
        {
            name: 'constant.language',
            pattern: /true|false|nil/g
        },
        {
            name: 'keyword.operator',
            pattern: /\+|\!|\-|&(gt|lt|amp);|\||\*|\=|#|\.{2}/g
        },
        {
            matches: {
                1: 'storage.function',
                2: 'entity.name.function'
            },
            pattern: /(function)\s+(\w+[\:|\.]?\w+?)(?=\()/g
        },
        {
            matches: {
                1: 'support.function'
            },
            pattern: /\b(print|require|module|\w+\.\w+)(?=\()/g
        }
    ],
    php: [
        {
            name: 'support',
            pattern: /\becho\b/ig
        },
        {
            matches: {
                1: 'variable.dollar-sign',
                2: 'variable'
            },
            pattern: /(\$)(\w+)\b/g
        },
        {
            name: 'constant.language',
            pattern: /true|false|null/ig
        },
        {
            name: 'constant',
            pattern: /\b[A-Z0-9_]{2,}\b/g
        },
        {
            name: 'keyword.dot',
            pattern: /\./g
        },
        {
            name: 'keyword',
            pattern: /\b(die|end(for(each)?|switch|if)|case|require(_once)?|include(_once)?)(?=\b)/ig
        },
        {
            matches: {
                1: 'keyword',
                2: {
                    name: 'support.class',
                    pattern: /\w+/g
                }
            },
            pattern: /(instanceof)\s([^\$].*?)(\)|;)/ig
        },

        /**
         * these are the top 50 most used PHP functions
         * found from running a script and checking the frequency of each function
         * over a bunch of popular PHP frameworks then combining the results
         */
        {
            matches: {
                1: 'support.function'
            },
            pattern: /\b(array(_key_exists|_merge|_keys|_shift)?|isset|count|empty|unset|printf|is_(array|string|numeric|object)|sprintf|each|date|time|substr|pos|str(len|pos|tolower|_replace|totime)?|ord|trim|in_array|implode|end|preg_match|explode|fmod|define|link|list|get_class|serialize|file|sort|mail|dir|idate|log|intval|header|chr|function_exists|dirname|preg_replace|file_exists)(?=\()/ig
        },
        {
            name: 'variable.language.php-tag',
            pattern: /(&lt;\?(php)?|\?&gt;)/ig
        },
        {
            matches: {
                1: 'keyword.namespace',
                2: {
                    name: 'support.namespace',
                    pattern: /\w+/g
                }
            },
            pattern: /\b(namespace|use)\s(.*?);/ig
        },
        {
            matches: {
                1: 'storage.modifier',
                2: 'storage.class',
                3: 'entity.name.class',
                4: 'storage.modifier.extends',
                5: 'entity.other.inherited-class',
                6: 'storage.modifier.extends',
                7: 'entity.other.inherited-class'
            },
            pattern: /\b(abstract|final)?\s?(class|interface|trait)\s(\w+)(\sextends\s)?([\w\\]*)?(\simplements\s)?([\w\\]*)?\s?\{?(\n|\})/ig
        },
        {
            name: 'keyword.static',
            pattern: /self::|static::/ig
        },
        {
            matches: {
                1: 'storage.function',
                2: 'entity.name.function.magic'
            },
            pattern: /(function)\s(__.*?)(?=\()/ig
        },
        {
            matches: {
                1: 'storage.function',
                2: 'entity.name.function'
            },
            pattern: /(function)\s(.*?)(?=\()/ig
        },
        {
            matches: {
                1: 'keyword.new',
                2: {
                    name: 'support.class',
                    pattern: /\w+/g
                }
            },
            pattern: /\b(new)\s([^\$][a-z0-9_\\]*?)(?=\)|\(|;)/ig
        },
        {
            matches: {
                1: {
                    name: 'support.class',
                    pattern: /\w+/g
                },
                2: 'keyword.static'
            },
            pattern: /([\w\\]*?)(::)(?=\b|\$)/g
        },
        {
            matches: {
                2: {
                    name: 'support.class',
                    pattern: /\w+/g
                }
            },
            pattern: /(\(|,\s?)([\w\\]*?)(?=\s\$)/g
        }
    ],
    ruby: [
        /**
        * __END__ DATA
        */
        {
            matches: {
                1: 'variable.language',
                2: {
                  language: null
                }
            },
            //find __END__ and consume remaining text
            pattern: /^(__END__)\n((?:.*\n)*)/gm
        },
        /**
         * Strings
         *   1. No support for multi-line strings
         */
        {
            name: 'string',
            matches: {
                1: 'string.open',
                2: [{
                    name: 'string.interpolation',
                    matches: {
                        1: 'string.open',
                        2: {
                          language: 'ruby'
                        },
                        3: 'string.close'
                    },
                    pattern: /(\#\{)(.*?)(\})/g
                }],
                3: 'string.close'
            },
            pattern: /("|`)(.*?[^\\\1])?(\1)/g
        },
        {
            name: 'string',
            pattern: /('|"|`)([^\\\1\n]|\\.)*?\1/g
        },
        {
            name: 'string',
            pattern: /%[qQ](?=(\(|\[|\{|&lt;|.)(.*?)(?:'|\)|\]|\}|&gt;|\1))(?:\(\2\)|\[\2\]|\{\2\}|\&lt;\2&gt;|\1\2\1)/g
        },
        /**
         * Heredocs
         * Heredocs of the form `<<'HTML' ... HTML` are unsupported.
         */
        {
            matches: {
                1: 'string',
                2: 'string',
                3: 'string'
            },
            pattern: /(&lt;&lt;)(\w+).*?$([\s\S]*?^\2)/gm
        },
        {
            matches: {
                1: 'string',
                2: 'string',
                3: 'string'
            },
            pattern: /(&lt;&lt;\-)(\w+).*?$([\s\S]*?\2)/gm
        },
        /**
         * Regular expressions
         * Escaped delimiter (`/\//`) is unsupported.
         */
        {
            name: 'string.regexp',
            matches: {
                1: 'string.regexp',
                2: {
                    name: 'string.regexp',
                    pattern: /\\(.){1}/g
                },
                3: 'string.regexp',
                4: 'string.regexp'
            },
            pattern: /(\/)(.*?)(\/)([a-z]*)/g
        },
        {
            name: 'string.regexp',
            matches: {
                1: 'string.regexp',
                2: {
                    name: 'string.regexp',
                    pattern: /\\(.){1}/g
                },
                3: 'string.regexp',
                4: 'string.regexp'
            },
            pattern: /%r(?=(\(|\[|\{|&lt;|.)(.*?)('|\)|\]|\}|&gt;|\1))(?:\(\2\)|\[\2\]|\{\2\}|\&lt;\2&gt;|\1\2\1)([a-z]*)/g
        },
        /**
         * Comments
         */
        {
            name: 'comment',
            pattern: /#.*$/gm
        },
        {
            name: 'comment',
            pattern: /^\=begin[\s\S]*?\=end$/gm
        },
        /**
         * Symbols
         */
        {
            matches: {
                1: 'constant'
            },
            pattern: /(\w+:)[^:]/g
        },
        {
            matches: {
                1: 'constant.symbol'
            },
            pattern: /[^:](:(?:\w+|(?=['"](.*?)['"])(?:"\2"|'\2')))/g
        },
        {
            name: 'constant.numeric',
            pattern: /\b(0x[\da-f]+|[\d_]+)\b/g
        },
        {
            name: 'support.class',
            pattern: /\b[A-Z]\w*(?=((\.|::)[A-Za-z]|\[))/g
        },
        {
            name: 'constant',
            pattern: /\b[A-Z]\w*\b/g
        },
        /**
         * Keywords, variables, constants, and operators
         *   In Ruby some keywords are valid method names, e.g., MyClass#yield
         *   Don't mark those instances as "keywords"
         */
        {
            matches: {
                1: 'storage.class',
                2: 'entity.name.class',
                3: 'entity.other.inherited-class'
            },
            pattern: /\s*(class)\s+((?:(?:::)?[A-Z]\w*)+)(?:\s+&lt;\s+((?:(?:::)?[A-Z]\w*)+))?/g
        },
        {
            matches: {
                1: 'storage.module',
                2: 'entity.name.class'
            },
            pattern: /\s*(module)\s+((?:(?:::)?[A-Z]\w*)+)/g
        },
        {
            name: 'variable.global',
            pattern: /\$([a-zA-Z_]\w*)\b/g
        },
        {
            name: 'variable.class',
            pattern: /@@([a-zA-Z_]\w*)\b/g
        },
        {
            name: 'variable.instance',
            pattern: /@([a-zA-Z_]\w*)\b/g
        },
        {
            matches: {
                1: 'keyword.control'
            },
            pattern: /[^\.]\b(BEGIN|begin|case|class|do|else|elsif|END|end|ensure|for|if|in|module|rescue|then|unless|until|when|while)\b(?![?!])/g
        },
        {
            matches: {
                1: 'keyword.control.pseudo-method'
            },
            pattern: /[^\.]\b(alias|alias_method|break|next|redo|retry|return|super|undef|yield)\b(?![?!])|\bdefined\?|\bblock_given\?/g
        },
        {
            matches: {
                1: 'constant.language'
            },
            pattern: /\b(nil|true|false)\b(?![?!])/g
        },
        {
            matches: {
                1: 'variable.language'
            },
            pattern: /\b(__(FILE|LINE)__|self)\b(?![?!])/g
        },
        {
            matches: {
                1: 'keyword.special-method'
            },
            pattern: /\b(require|gem|initialize|new|loop|include|extend|raise|attr_reader|attr_writer|attr_accessor|attr|catch|throw|private|module_function|public|protected)\b(?![?!])/g
        },
        {
            name: 'keyword.operator',
            pattern: /\s\?\s|=|&lt;&lt;|&lt;&lt;=|%=|&=|\*=|\*\*=|\+=|\-=|\^=|\|{1,2}=|&lt;&lt;|&lt;=&gt;|&lt;(?!&lt;|=)|&gt;(?!&lt;|=|&gt;)|&lt;=|&gt;=|===|==|=~|!=|!~|%|&amp;|\*\*|\*|\+|\-|\/|\||~|&gt;&gt;/g
        },
        {
            matches: {
                1: 'keyword.operator.logical'
            },
            pattern: /[^\.]\b(and|not|or)\b/g
        },

        /**
        * Functions
        *   1. No support for marking function parameters
        */
        {
            matches: {
                1: 'storage.function',
                2: 'entity.name.function'
            },
            pattern: /(def)\s(.*?)(?=(\s|\())/g
        }
    ],
    sql: [
        {
            matches: {
                2: {
                    name: 'string',
                    matches: {
                        name: 'constant.character.escape',
                        pattern: /\\('|"|`){1}/g
                    }
                }
            },
            pattern: /(\(|\s|\[|\=|:|\+|\.|\{|,)(('|"|`)([^\\\1]|\\.)*?(\3))/gm
        },
        {
            name: 'comment',
            pattern: /--.*$|\/\*[\s\S]*?\*\/|(\/\/)[\s\S]*?$/gm
        },
        {
            name: 'constant.numeric',
            pattern: /\b(\d+(\.\d+)?(e(\+|\-)?\d+)?(f|d)?|0x[\da-f]+)\b/gi
        },
        {
            name: 'function.call',
            pattern: /(\w+?)(?=\()/g
        },
        {
            name: 'keyword',
            pattern: /\b(ABSOLUTE|ACTION|ADA|ADD|ALL|ALLOCATE|ALTER|AND|ANY|ARE|AS|ASC|ASSERTION|AT|AUTHORIZATION|AVG|BEGIN|BETWEEN|BIT|BIT_LENGTH|BOTH|BY|CASCADE|CASCADED|CASE|CAST|CATALOG|CHAR|CHARACTER|CHARACTER_LENGTH|CHAR_LENGTH|CHECK|CLOSE|COALESCE|COLLATE|COLLATION|COLUMN|COMMIT|CONNECT|CONNECTION|CONSTRAINT|CONSTRAINTS|CONTINUE|CONVERT|CORRESPONDING|COUNT|CREATE|CROSS|CURRENT|CURRENT_DATE|CURRENT_TIME|CURRENT_TIMESTAMP|CURRENT_USER|CURSOR|DATE|DAY|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFERRABLE|DEFERRED|DELETE|DESC|DESCRIBE|DESCRIPTOR|DIAGNOSTICS|DISCONNECT|DISTINCT|DOMAIN|DOUBLE|DROP|ELSE|END|END-EXEC|ESCAPE|EXCEPT|EXCEPTION|EXEC|EXECUTE|EXISTS|EXTERNAL|EXTRACT|FALSE|FETCH|FIRST|FLOAT|FOR|FOREIGN|FORTRAN|FOUND|FROM|FULL|GET|GLOBAL|GO|GOTO|GRANT|GROUP|HAVING|HOUR|IDENTITY|IMMEDIATE|IN|INCLUDE|INDEX|INDICATOR|INITIALLY|INNER|INPUT|INSENSITIVE|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|IS|ISOLATION|JOIN|KEY|LANGUAGE|LAST|LEADING|LEFT|LEVEL|LIKE|LIMIT|LOCAL|LOWER|MATCH|MAX|MIN|MINUTE|MODULE|MONTH|NAMES|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONE|NOT|NULL|NULLIF|NUMERIC|OCTET_LENGTH|OF|ON|ONLY|OPEN|OPTION|OR|ORDER|OUTER|OUTPUT|OVERLAPS|PAD|PARTIAL|PASCAL|POSITION|PRECISION|PREPARE|PRESERVE|PRIMARY|PRIOR|PRIVILEGES|PROCEDURE|PUBLIC|READ|REAL|REFERENCES|RELATIVE|RESTRICT|REVOKE|RIGHT|ROLLBACK|ROWS|SCHEMA|SCROLL|SECOND|SECTION|SELECT|SESSION|SESSION_USER|SET|SIZE|SMALLINT|SOME|SPACE|SQL|SQLCA|SQLCODE|SQLERROR|SQLSTATE|SQLWARNING|SUBSTRING|SUM|SYSTEM_USER|TABLE|TEMPORARY|THEN|TIME|TIMESTAMP|TIMEZONE_HOUR|TIMEZONE_MINUTE|TO|TRAILING|TRANSACTION|TRANSLATE|TRANSLATION|TRIM|TRUE|UNION|UNIQUE|UNKNOWN|UPDATE|UPPER|USAGE|USER|USING|VALUE|VALUES|VARCHAR|VARYING|VIEW|WHEN|WHENEVER|WHERE|WITH|WORK|WRITE|YEAR|ZONE|USE)(?=\b)/gi
        },
        {
            name: 'keyword.operator',
            pattern: /\+|\!|\-|&(gt|lt|amp);|\||\*|=/g
        }
    ],
    scheme: [
        {
            /* making peace with HTML */
            name: 'plain',
            pattern: /&gt;|&lt;/g
        },
        {
            name: 'comment',
            pattern: /;.*$/gm
        },
        {
            name: 'constant.language',
            pattern: /#t|#f|'\(\)/g
        },
        {
            name: 'constant.symbol',
            pattern: /'[^()\s#]+/g
        },
        {
            name: 'constant.number',
            pattern: /\b\d+(?:\.\d*)?\b/g
        },
        {
            name: 'string',
            pattern: /".+?"/g
        },
        {
            matches: {
                1: 'storage.function',
                2: 'variable'
            },
            pattern: /\(\s*(define)\s+\(?(\S+)/g
        },
        {
            matches: {
                1: 'keyword'
            },
            pattern: /\(\s*(begin|define\-syntax|if|lambda|quasiquote|quote|set!|syntax\-rules|and|and\-let\*|case|cond|delay|do|else|or|let|let\*|let\-syntax|letrec|letrec\-syntax)(?=[\]()\s#])/g
        },
        {
            matches: {
                1: 'entity.function'
            },
            pattern: /\(\s*(eqv\?|eq\?|equal\?|number\?|complex\?|real\?|rational\?|integer\?|exact\?|inexact\?|=|<|>|<=|>=|zero\?|positive\?|negative\?|odd\?|even\?|max|min|\+|\-|\*|\/|abs|quotient|remainder|modulo|gcd|lcm|numerator|denominator|floor|ceiling|truncate|round|rationalize|exp|log|sin|cos|tan|asin|acos|atan|sqrt|expt|make\-rectangular|make\-polar|real\-part|imag\-part|magnitude|angle|exact\->inexact|inexact\->exact|number\->string|string\->number|not|boolean\?|pair\?|cons|car|cdr|set\-car!|set\-cdr!|caar|cadr|cdar|cddr|caaar|caadr|cadar|caddr|cdaar|cdadr|cddar|cdddr|caaaar|caaadr|caadar|caaddr|cadaar|cadadr|caddar|cadddr|cdaaar|cdaadr|cdadar|cdaddr|cddaar|cddadr|cdddar|cddddr|null\?|list\?|list|length|append|reverse|list\-tail|list\-ref|memq|memv|member|assq|assv|assoc|symbol\?|symbol\->string|string\->symbol|char\?|char=\?|char<\?|char>\?|char<=\?|char>=\?|char\-ci=\?|char\-ci<\?|char\-ci>\?|char\-ci<=\?|char\-ci>=\?|char\-alphabetic\?|char\-numeric\?|char\-whitespace\?|char\-upper\-case\?|char\-lower\-case\?|char\->integer|integer\->char|char\-upcase|char\-downcase|string\?|make\-string|string|string\-length|string\-ref|string\-set!|string=\?|string\-ci=\?|string<\?|string>\?|string<=\?|string>=\?|string\-ci<\?|string\-ci>\?|string\-ci<=\?|string\-ci>=\?|substring|string\-append|string\->list|list\->string|string\-copy|string\-fill!|vector\?|make\-vector|vector|vector\-length|vector\-ref|vector\-set!|vector\->list|list\->vector|vector\-fill!|procedure\?|apply|map|for\-each|force|call\-with\-current\-continuation|call\/cc|values|call\-with\-values|dynamic\-wind|eval|scheme\-report\-environment|null\-environment|interaction\-environment|call\-with\-input\-file|call\-with\-output\-file|input\-port\?|output\-port\?|current\-input\-port|current\-output\-port|with\-input\-from\-file|with\-output\-to\-file|open\-input\-file|open\-output\-file|close\-input\-port|close\-output\-port|read|read\-char|peek\-char|eof\-object\?|char\-ready\?|write|display|newline|write\-char|load|transcript\-on|transcript\-off)(?=[\]()\s#])/g
        }
    ],
    r: [
        /**
         * Note that a valid variable name is of the form:
         * [.a-zA-Z][0-9a-zA-Z._]*
         */
        {
            matches: {
                1: {
                    name: 'keyword.operator',
                    pattern: /\=|<\-|&lt;-/g
                },
                2: {
                    name: 'string',
                    matches: {
                        name: 'constant.character.escape',
                        pattern: /\\('|"){1}/g
                    }
                }
            },
            pattern: /(\(|\s|\[|\=|:)(('|")([^\\\1]|\\.)*?(\3))/gm
        },

        /**
         * Most of these are known via the Language Reference.
         * The built-in constant symbols are known via ?Constants.
         */
        {
            matches: {
                1: 'constant.language'
            },
            pattern: /\b(NULL|NA|TRUE|FALSE|T|F|NaN|Inf|NA_integer_|NA_real_|NA_complex_|NA_character_)\b/g
        },
        {
            matches: {
                1: 'constant.symbol'
            },
            pattern: /[^0-9a-zA-Z\._](LETTERS|letters|month\.(abb|name)|pi)/g
        },

        /**
         * @todo: The list subsetting operator isn't quite working properly.
         *        It includes the previous variable when it should only match [[
         */
        {
            name: 'keyword.operator',
            pattern: /&lt;-|<-|-|==|&lt;=|<=|&gt;>|>=|<|>|&amp;&amp;|&&|&amp;|&|!=|\|\|?|\*|\+|\^|\/|%%|%\/%|\=|%in%|%\*%|%o%|%x%|\$|:|~|\[{1,2}|\]{1,2}/g
        },
        {
            matches: {
                1: 'storage',
                3: 'entity.function'
            },
            pattern: /(\s|^)(.*)(?=\s?=\s?function\s\()/g
        },
        {
            matches: {
                1: 'storage.function'
            },
            pattern: /[^a-zA-Z0-9._](function)(?=\s*\()/g
        },
        {
            matches: {
                1: 'namespace',
                2: 'keyword.operator',
                3: 'function.call'
            },
            pattern: /([a-zA-Z][a-zA-Z0-9._]+)([:]{2,3})([.a-zA-Z][a-zA-Z0-9._]*(?=\s*\())\b/g
        },

        /*
         * Note that we would perhaps match more builtin functions and
         * variables, but there are so many that most are ommitted for now.
         * See ?builtins for more info.
         *
         * @todo: Fix the case where we have a function like tmp.logical().
         *        This should just be a function call, at the moment it's
         *        only partly a function all.
         */
        {
            name: 'support.function',
            pattern: /(^|[^0-9a-zA-Z\._])(array|character|complex|data\.frame|double|integer|list|logical|matrix|numeric|vector)(?=\s*\()/g
        }
    ],
    haskell: [
        ///- Comments
        {
            name: 'comment',
            pattern: /\{\-\-[\s\S(\w+)]+[\-\-][\}$]/gm
            // /\{\-{2}[\s\S(.*)]+[\-\-][\}$]/gm [multiple lines]
        },
        {
            name: 'comment',
            pattern: /\-\-(.*)/g
            // /\-\-\s(.+)$/gm [single]
        },
        ///- End Comments

        ///- Namespace (module)
        {
            matches: {
                1: 'keyword',
                2: 'support.namespace'
            },
            pattern: /\b(module)\s(\w+)\s[\(]?(\w+)?[\)?]\swhere/g
        },
        ///- End Namespace (module)

        ///- Keywords and Operators
        {
            name: 'keyword.operator',
            pattern: /\+|\!|\-|&(gt|lt|amp);|\/\=|\||\@|\:|\.|\+{2}|\:|\*|\=|#|\.{2}|(\\)[a-zA-Z_]/g
        },
        {
            name: 'keyword',
            pattern: /\b(case|class|foreign|hiding|qualified|data|family|default|deriving|do|else|if|import|in|infix|infixl|infixr|instance|let|in|otherwise|module|newtype|of|then|type|where)\b/g
        },
        {
            name: 'keyword',
            pattern: /[\`][a-zA-Z_']*?[\`]/g
        },
        ///- End Keywords and Operators


        ///- Infix|Infixr|Infixl
        {
            matches: {
                1: 'keyword',
                2: 'keyword.operator'
            },
            pattern: /\b(infix|infixr|infixl)+\s\d+\s(\w+)*/g
        },
        ///- End Infix|Infixr|Infixl

        {
            name: 'entity.class',
            pattern: /\b([A-Z][A-Za-z0-9_']*)/g
        },

        // From c.js
        {
            name: 'meta.preprocessor',
            matches: {
                1: [
                    {
                        matches: {
                            1: 'keyword.define',
                            2: 'entity.name'
                        },
                        pattern: /(\w+)\s(\w+)\b/g
                    },
                    {
                        name: 'keyword.define',
                        pattern: /endif/g
                    },
                    {
                        name: 'constant.numeric',
                        pattern: /\d+/g
                    },
                    {
                        matches: {
                            1: 'keyword.include',
                            2: 'string'
                        },
                     pattern: /(include)\s(.*?)$/g
                    }
                ]
            },
            pattern: /^\#([\S\s]*?)$/gm
        }
    ],
    d: [
        {
            name: 'constant',
            pattern: /\b(false|null|true)\b/gm
        },
        {
            // http://dlang.org/lex.html
            name: 'keyword',
            pattern: /\b(abstract|alias|align|asm|assert|auto|body|bool|break|byte|case|cast|catch|cdouble|cent|cfloat|char|class|const|continue|creal|dchar|debug|default|delegate|delete|deprecated|do|double|else|enum|export|extern|final|finally|float|for|foreach|foreach_reverse|function|goto|idouble|if|ifloat|immutable|import|in|inout|int|interface|invariant|ireal|is|lazy|long|macro|mixin|module|new|nothrow|null|out|override|package|pragma|private|protected|public|pure|real|ref|return|scope|shared|short|size_t|static|string|struct|super|switch|synchronized|template|this|throw|try|typedef|typeid|typeof|ubyte|ucent|uint|ulong|union|unittest|ushort|version|void|volatile|wchar|while|with|__FILE__|__LINE__|__gshared|__traits|__vector|__parameters)\b/gm
        },
        {
            matches: {
                1: 'keyword',
                2: {
                    name: 'support.class',
                    pattern: /\w+/gm
                }
            },
            pattern: /(typeof)\s([^\$].*?)(\)|;)/gm
        },
        {
            matches: {
                1: 'keyword.namespace',
                2: {
                    name: 'support.namespace',
                    pattern: /\w+/gm
                }
            },
            pattern: /\b(namespace)\s(.*?);/gm
        },
        {
            matches: {
                1: 'storage.modifier',
                2: 'storage.class',
                3: 'entity.name.class',
                4: 'storage.modifier.extends',
                5: 'entity.other.inherited-class'
            },
            pattern: /\b(abstract|sealed)?\s?(class)\s(\w+)(\sextends\s)?([\w\\]*)?\s?\{?(\n|\})/gm
        },
        {
            name: 'keyword.static',
            pattern: /\b(static)\b/gm
        },
        {
            matches: {
                1: 'keyword.new',
                2: {
                    name: 'support.class',
                    pattern: /\w+/gm
                }

            },
            pattern: /\b(new)\s([^\$].*?)(?=\)|\(|;|&)/gm
        },
        {
            name: 'string',
            pattern: /("|')(.*?)\1/gm
        },
        {
            name: 'integer',
            pattern: /\b(0x[\da-f]+|\d+)\b/gm
        },
        {
            name: 'comment',
            pattern: /\/\*[\s\S]*?\*\/|\/\+[\s\S]*?\+\/|(\/\/)[\s\S]*?$/gm
        },
        {
            // http://dlang.org/operatoroverloading.html
            name: 'operator',
            //  / /= &= && & |= || | -= -- - += ++ + <= << < <<= <>= <> > >>>= >>= >= >> >>> != !<>= !<> !<= !< !>= !> ! [ ] $ == = *= * %= % ^^= ^= ^^ ^ ~= ~ @ => :
            pattern: /(\/|\/=|&amp;=|&amp;&amp;|&amp;|\|=|\|\|\||\-=|\-\-|\-|\+=|\+\+|\+|&lt;=|&lt;&lt;|&lt;|&lt;&lt;=|&lt;&gt;=|&lt;&gt;|&gt;|&gt;&gt;&gt;=|&gt;&gt;=|&gt;=|&gt;&gt;|&gt;&gt;&gt;|!=|!&lt;&gt;=|!&lt;&gt;|!&lt;=|!&lt;|!&gt;=|!&gt;|!|[|]|\$|==|=|\*=|\*|%=|%|\^\^=|\^=|\^\^|\^|~=|~|@|=&gt;|\:)/gm
        }
    ],
    smalltalk: [
        {
            name: 'keyword.pseudovariable',
            pattern: /self|thisContext/g
        },
        {
            name: 'keyword.constant',
            pattern: /false|nil|true/g
        },
        {
            name: 'string',
            pattern: /'([^']|'')*'/g
        },
        {
            name: 'string.symbol',
            pattern: /#\w+|#'([^']|'')*'/g
        },
        {
            name: 'string.character',
            pattern: /\$\w+/g
        },
        {
            name: 'comment',
            pattern: /"([^"]|"")*"/g
        },
        {
            name: 'constant.numeric',
            pattern: /-?\d+(\.\d+)?((r-?|s)[A-Za-z0-9]+|e-?[0-9]+)?/g
        },
        {
            name: 'entity.name.class',
            pattern: /\b[A-Z]\w*/g
        },
        {
            name: 'entity.name.function',
            pattern: /\b[a-z]\w*:?/g
        },
        {
            name: 'entity.name.binary',
            pattern: /(&lt;|&gt;|&amp;|[=~\|\\\/!@*\-_+])+/g
        },
        {
            name: 'operator.delimiter',
            pattern: /;[\(\)\[\]\{\}]|#\[|#\(^\./g
        }
    ],
    oz : [
        // https://github.com/mozart/vscode-oz/blob/master/syntaxes/oz.tmLanguage.json
        // TODO add missing css
        {
            name: "operator",
            pattern: /(<:|:>|::|&|@|#|_|\[\]|\.\.\.)/g
        },
        {
            name: "operator.assignment",
            pattern: /(\=|\:=)/g
        },
        {
            name: "operator.comparison",
            pattern: /<|=<|==|\=|>=|>/g
        },
        {
            name: "operator.list",
            pattern: /\b\|\b/g
        },
        {
            name: "constant.numeric",
            pattern: /(\d+\.\d+|\d+)/g
        },
        {
            name: "constant.language",
            pattern: /\b(false|true|nil)\b/g
        },
        {
            name: "variable",
            pattern: /[A-Z][0-9A-z]*/g
        },
        {
            name: "keyword.control",
            pattern: /(?<!'|\")\b(then|andthen|at|attr|choice|class|cond|declare|define|dis|div|do|elsecase|export|fail|feat|finally|for|from|functor|import|in|lazy|lock|meth|mod|not|of|or|orelse|prepare|prop|require|self|skip|then|thread|unit|end|local)\b/g
        },
        {
            name: "keyword.control.conditional",
            pattern: /(?<!'|\")\b(else|elseif|if)\b/g
        },
        {
            name: "keyword.control.function",
            pattern: /(?<!'|\")\b(fun|proc)\b/g
        },
        {
            name: "keyword.control.trycatch",
            pattern: /(?<!'|\")\b(catch|raise|try|finally)\b/g
        },
        {
            name: "keyword.control.case",
            pattern: /(?<!'|\")\b(case|of|then)\b/g
        },
        {
            name: "entity.function",
            pattern: /{([A-Z[A-z0-9]+\.*]+|\$)/g,
        },
        {
            name: "string.quoted.double",
            pattern: /(\")(.*?)(\")/g,
        },
        {
            name: "string.quoted.single",
            pattern: /(')(.*?)(')/g,
        },
        {
            name: "string.unquoted",
            pattern: /\b([a-z][A-Za-z0-9]*?)\b/g,

        },
        {
            name: "meta.list.position",
            pattern: /\b[A-Z][A-Za-z0-9]*(\.[\d]+)\b/g,
        },
        {
            name: "comment.line.number-sign",
            pattern: /%.*/g,
        },
        {
            name: "invalid.illegal.incomplete-assigment",
            pattern: /\b[A-Z][0-9a-zA-Z]*\s*=\s*\n/g
        },
        {
            name: "keyword.control.arithmetic",
            pattern: /(\*|\+|\-|\/|~)|\b(div|mod)\b/g
        },
        {
            name: "comment.block",
            pattern: "^/\* =(\s*.*?)\s*= \*/$\n?"
        },
        {
            name: "\*/.*\n",
            pattern: "invalid.illegal.stray-comment-end"
        },
    ],
    /*erlang: [
        {
            name: "variable.other.erlang",
            pattern: /(_[a-zA-Z\d@_]+\+|[A-Z][a-zA-Z\d@_]*\+)|(_)/g
        },
        {
            name: "keyword.operator.textual.erlang",
            pattern: /\b(andalso|band|and|bxor|xor|bor|orelse|or|bnot|not|bsl|bsr|div|rem)\b/g
        },
        {
            name: "keyword.operator.symbolic.erlang",
            pattern: /\+\+|\+|--|-|\*|\/=|\/|=\/=|=:=|==|=&lt;|=|&lt;-|&lt;|&gt;=|&gt;|!|::/g
        },
        {
            name: "constant.other.placeholder.erlang",
            pattern: /(~)(\*)?(\d+\+)?[~du\-#fsacl]/g
        },
        {
            name: "(~)((\\-)?\\d++|(\\*))?((\\.)(\\d++|(\\*)))?((\\.)((\\*)|.))?[~cfegswpWPBX#bx\\+ni]",
            pattern: /constant.other.placeholder.erlang/g
        },
        {
            name: "constant.character.escape.erlang",
            pattern: /(\\)([bdefnrstv\\'"]|(\^)[@-_]|[0-7]{1,3})/g
        },
        {
            name: "keyword.operator.record.erlang",
            pattern: /(#)\s*\+([a-z][a-zA-Z\d@_]*\+|'[^']*\+')/g
        },
        {
            name: "meta.record-usage.erlang",
            pattern: /(#)\s*\+([a-z][a-zA-Z\d@_]*\+|'[^']*\+')\s*\+(\.)\s*\+([a-z][a-zA-Z\d@_]*\+|'[^']*\+')/g
        },
        {
            name: "keyword.control.directive.import.erlang",
            pattern: /^(\s*|(-)\s*|(record)\s*|(\()\s*|([a-z][a-zA-Z\d@_]*||'[^']*|')\s*|(,))/g
        },
    ]*/
};

