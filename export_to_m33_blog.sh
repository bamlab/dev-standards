#!/bin/sh


# ✔ rename file adding date and add to export folder
# ✔ add header
# ✔ convert path to category, prefixed with BAM, using last directory as category
# ✔ convert slug to category name
# - FOR EACH

DEST_DIR="export"

if [ ! -d "$DEST_DIR" ]; then
    mkdir $DEST_DIR
fi

# DEBUG:
# echo $FILES

for FILE in $(find . -mindepth 2 -iname '*.md')
do
    TEMPLATE="intro.tpl"
    DATE=$(git log --follow --date=short --format=%ad -- "$FILE" | tail -1)
    NEW_NAME="$DATE-$(basename $FILE)"
    DEST="$DEST_DIR"/"$NEW_NAME"

    cp "$TEMPLATE" "$DEST"
    cat $FILE >> $DEST

    TITLE=$(head -1 $FILE | sed -r 's/#\s?//g')
    CATEGORY=$(dirname $FILE | grep -o '[^/]*$' | sed 's/^\(.\)/\U\1/' | sed 's/-/ /g')
    sed -i -- "s/%CATEGORY%/${CATEGORY//\//\\/}/g" $DEST
    sed -i -- "s/%TITLE%/${TITLE//\//\\/}/g" $DEST
done