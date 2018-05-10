. Bugs:
1. When deleting blue font(BUF), the first black font(BLF) is deleted - C
2. Move cursor to next position when BLF is selected and any char keys are pressed. -- C
3. Track changes in styling as well. - I
4. When user selects BLF+BUF then all are striked out. - C
5. The line breaks should also be tracked. - C
6. with ctrl+A all fonts becomes BLF - C 
7. Get raw html for the selected texts/paragraphs to handle delete scenario in track changes - C
8. with ctrl+A line break BUF becomes black - C
9. Remove new Line breaks when deleted - C
10. Line beaks without blue fonts are not detected - C
11. With `list` tag, the backspace doesn't work - I (stopped the feature)
12. "Enter" doesnt work on line end. - Imp (reason: <br class="new"> is inserted once and doesnt work after that) - C
13. "paste" event should paste only blue color. No styling should exist. - I
14. Backspace doesn't work when para is changed.<br class="new"> should get removed. - I (user need to select and then press del button)
15. Implement Backspace behavior to remove two times backspace click.
16. add events for symbols / special chars as well - C
17. if selection is only blue fonts, it's not getting deleted - C
18. if BLK and BLU font is selected and a char key is pressed, blue font is "striked" too. - I (stopped the feature)
19. Remove "strike" from nbsp; - C
20. Not able to delete <li> tags - I (stopped the feature)
21. Del selected image - C
22. Unable to delete Table - VVImp
24. Track new and old img style
25. Img with Color of cursor as blue and one extra space  before it is getting deleted (
 //Desc: if an img/tables is surrounded by <font> of BLU , then 
		// iterate through it
		// retain delete only those img and table which has "new" and retain the rest of DOM
		// DONT JUST DEL FONT TAGS as it may contain something that do not have "new" class. We need to retain that.

)

26. Intenal row deletion removes table structure - C
27. Check deletion of nested table (new is added to old one)
28. BLK font is getting deleted when user clicks inside BLK text after already pressing backspace with some other BLK text. - C
29. Image surrounded by BLU is getting deleted - Tricky happens in certain scenario. Needs investigation


Task:
1. Add key events for special chars. - C
2. Add blue color for new changes. - C
3. Strike out when a BLF is deleted. - C
4. Investigate to utilize document fragment. - C
5. How deletion of img will be tracked ?
6. provide a styling to deleted & new img.
7. Allow key combination for execCommand of bold italic and underline - C

RESTRICTION:
	

EXPECTED BEHAVIOR FROM SERVER:

1. Remove all <span> & </span> tags after data is passed to server
2. "new" class for <br> should be replaced once submitted to server as it'll create conflict when rendered next time.
3. Differences of line brakes can be handled by server by checking line break class "new"
4. convert image to from base64 to uploaded server url
