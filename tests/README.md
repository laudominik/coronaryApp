# Acceptance tests for CoronaryApp
Setup venv
```
python -m venv .venv
```
get deps
```
pip install -r requirements.txt
```
run
```
python -m robot testcases/
```

# Running on CI
To view your changes on the CI, version.txt must be bumped.