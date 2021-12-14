(TeX-add-style-hook
 "cv"
 (lambda ()
   (TeX-add-to-alist 'LaTeX-provided-class-options
                     '(("article" "5pt")))
   (TeX-add-to-alist 'LaTeX-provided-package-options
                     '(("inputenc" "utf8") ("geometry" "a4paper" "left=2cm" "right=2cm" "top=2cm" "bottom=2cm")))
   (TeX-run-style-hooks
    "latex2e"
    "article"
    "art10"
    "inputenc"
    "array"
    "xcolor"
    "lipsum"
    "bibentry"
    "geometry")
   (TeX-add-symbols
    "VRule")
   (LaTeX-add-array-newcolumntypes
    "L"
    "R"
    "C")
   (LaTeX-add-xcolor-definecolors
    "lightgray"))
 :latex)

