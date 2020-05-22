coffeeBuild="./NeonX/sys/explorer"
typescriptBuild="./NeonX/sys/desktop"

# build coffeescript files
for c in ${coffeeBuild[@]}; do
    rm $c.js
    coffee -c $c.coffee
done

# build typescript files
for t in ${typescriptBuild[@]}; do
    rm $t.js
    coffee -c $t.ts
done