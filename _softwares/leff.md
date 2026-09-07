---
name: Spectral framework to measure diversity in MSAs
topic: method
image: /assets/images/software/effective_length_intuition.png
site: https://github.com/vaiteaopuu/effective_length
---
Leff, the effective sequence length, is a way of saying how much real variety a
collection of sequences actually holds. A dataset can contain thousands of
entries and still repeat itself, because many sequences are near-copies shaped
by shared ancestry or by designs that barely stray from one template. Leff
answers a simple question: if every position in a sequence were free to change
on its own, how long would that sequence have to be to show as much variety as
the data we have? A large L_eff means the collection explores a wide range of
possibilities; a small one means the variation is limited and repetitive, even
if the dataset is large. Because it looks at how the whole sequence varies
together rather than one position at a time, it reflects the constraints that
tie positions to each other.
