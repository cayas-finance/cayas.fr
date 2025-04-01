#!/bin/bash

# Function to extract links from HTML content for cross-platform compatibility
extract_links() {
    if grep -V | grep -q "GNU grep"; then
        # GNU grep (Linux) - use Perl regex
        echo "$1" | grep -oP '(?<=href=")[^"]*\.[^"]*'
    else
        # BSD grep (macOS) - use alternative approach
        echo "$1" | grep -o 'href="[^"]*\.[^"]*"' | sed 's/href="//g' | sed 's/"//g'
    fi
}

echo "Downloading SCSS files..."
PAGE_CONTENT=$(curl -s "https://studio.stpo.fr/cayas-app/dev/scss/")
LINKS=$(extract_links "$PAGE_CONTENT")

for FICHIER in $LINKS; do
    wget -O "./scss/$FICHIER" -q "https://studio.stpo.fr/cayas-app/dev/scss/$FICHIER"
    # Replace "../../static/" or "/img/" with "/" in each SCSS file
    if [[ "$FICHIER" == *.scss ]]; then
        sed -i.bak 's|../../static/|/assets/|g' "./scss/$FICHIER" && rm "./scss/$FICHIER.bak"
        sed -i.bak 's|/img/|/assets/|g' "./scss/$FICHIER" && rm "./scss/$FICHIER.bak"
        sed -i.bak 's|../../fonts/|/assets/fonts/|g' "./scss/$FICHIER" && rm "./scss/$FICHIER.bak"        
    fi
    echo "$FICHIER"
done

echo "Downloading generic images..."
PAGE_CONTENT=$(curl -s "https://studio.stpo.fr/cayas-app/static/img/generic/")
LINKS=$(extract_links "$PAGE_CONTENT")

for FICHIER in $LINKS; do
    wget -O "./assets/generic/$FICHIER" -q "https://studio.stpo.fr/cayas-app/static/img/generic/$FICHIER"
    echo "$FICHIER"
done

echo "Downloading sprite images..."
PAGE_CONTENT=$(curl -s "https://studio.stpo.fr/cayas-app/static/img/svg-sprite/")
LINKS=$(extract_links "$PAGE_CONTENT")

# ignore *.html
LINKS=$(echo "$LINKS" | grep -v "\.html$")

for FICHIER in $LINKS; do
    wget -O "./assets/svg-sprite/$FICHIER" -q "https://studio.stpo.fr/cayas-app/static/img/svg-sprite/$FICHIER"
    echo "$FICHIER"
done

echo "Downloading favicons..."
PAGE_CONTENT=$(curl -s "https://studio.stpo.fr/cayas-app/static/img/favicon/")
LINKS=$(extract_links "$PAGE_CONTENT")

# ignore manifest.json
LINKS=$(echo "$LINKS" | grep -v "manifest.json")

for FICHIER in $LINKS; do
    wget -O "./assets/favicon/$FICHIER" -q "https://studio.stpo.fr/cayas-app/static/img/favicon/$FICHIER"
    echo "$FICHIER"
done

echo "Downloading icon fonts..."
PAGE_CONTENT=$(curl -s "https://studio.stpo.fr/cayas-app/static/img/icon-font/")
LINKS=$(extract_links "$PAGE_CONTENT")

for FICHIER in $LINKS; do
    wget -O "./assets/icon-font/$FICHIER" -q "https://studio.stpo.fr/cayas-app/static/img/icon-font/$FICHIER"
    echo "$FICHIER"
done

echo "Downloading fonts..."
PAGE_CONTENT=$(curl -s "https://studio.stpo.fr/cayas-app/fonts/")
LINKS=$(extract_links "$PAGE_CONTENT")

for FICHIER in $LINKS; do
    wget -O "./assets/fonts/$FICHIER" -q "https://studio.stpo.fr/cayas-app/fonts/$FICHIER"
    echo "$FICHIER"
done

npx prettier scss --write
