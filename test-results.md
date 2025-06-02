# This is the testing results for local and production

## used video for testing big buck bunny 10:34

# Video data

1. 240p = 48MB -> 61 KB/s
2. 480p = 100MB -> 170 KB/s
3. 720p = 213MB -> 341 KB/s

# Testing results

## Production testing

1. USER A (download 30Mb/s, upload 34Mb/s)

abs-with-ema

- quality changed counts = 6
- buffering counts = 0
- total buffering time = 0 ms

abs-only

- quality changed counts = 12
- buffering counts = 1
- total buffering time = 32 ms

progressive download

- quality changed counts = -
- buffering counts = 20
- total buffering time = 153408 ms

2. USER B (download 28Mb/s, upload 16Mb/s)

abs-with-ema

- quality changed counts = 8
- buffering counts = 0
- total buffering time = 0 ms

abs-only

- quality changed counts = 16
- buffering counts = 2
- total buffering time = 356 ms

progressive download

- quality changed counts = -
- buffering counts = 23
- total buffering time = 171008 ms

3. USER C (download 4Mb/s, upload 2Mb/s)

abs-with-ema

- quality changed counts = 7
- buffering counts = 1
- total buffering time = 10 ms

abs-only

- quality changed counts = 42
- buffering counts = 8
- total buffering time = 5808 ms

progressive download

- quality changed counts = -
- buffering counts = 23
- total buffering time = 171008 ms

## Local testing

speed yang ditentukan
437,148,748,690,602,572,852,731,539,377,502,561,684,649,266,745,998,122,663,104,237,375,630,374,941

abs only

- quality changed counts = 52
- buffering counts = 1
- total buffering time = 4 ms

abs with ema n 5

- quality changed counts = 3
- buffering counts = 1
- total buffering time = 1 ms

abs with ema n 10

- quality changed counts = 2
- buffering counts = 2
- total buffering time = 2 ms

abs with ema n 15

- quality changed counts = 2
- buffering counts = 0
- total buffering time = 0 ms
