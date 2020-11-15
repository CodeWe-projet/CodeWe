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
    ]
};