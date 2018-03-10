# Separating into arrays containing words of different length
### Do this once and never again

---
## Method of choice: regex replace, via Notepad++
---
- start of line is ^
- end of line is $
---
### Regexes attempted previously (here for future reference)

> .+("[a-z]{7}"\,).+

> .*("[a-z]{7}"\,).*

> ("[a-z]{1,6}"\,)

> ("[a-z]{3,20}"\,)

> "[a-z]{3,20}"\,

> \n\r

> \n$1\n

---
### Method of choice
https://superuser.com/questions/477628/export-all-regular-expression-matches-in-textpad-or-notepad-as-a-list

- Find the matches using regex (say %(.\*?)% ) and replace it by \n%\1%\n , after this we will have our target word in separate lines (i.e. no line will have more than one matched word)
Use the Search-->Find-->Mark functionality to mark each line with regex %(.\*?)% and remember to tick 'Bookmark Line' before marking the text
- Select Search-->Bookmark-->Remove Unmarked Lines
- Save the remaining text. It is the required list.

---

- Instead of pulling them out into individual lines, just have each word in its own line
- i.e. replace , with ,\n
- then mark

> ("[a-z]{yourNumberHere}"\,)

> ("[a-z]{4}"\,)

> \n$1\n
