.PHONY: license
.PHONY: setup
.PHONY: ci cd
.PHONY: run

MKFILE_PATH:=$(abspath $(lastword $(MAKEFILE_LIST)))
CURRENT_ABS_DIR:=$(patsubst %/,%,$(dir $(MKFILE_PATH)))
# MODEL_ID=Seethal/sentiment_analysis_generic_dataset
MODEL_ID=distilbert-base-uncased-finetuned-sst-2-english
PROJECT_NAME:=api

#################################################################################
# COMMANDS -- Setup                                                             #
#################################################################################
setup: install install-dev ## Setup the project

clean: clean-build clean-pyc clean-test ## Clean the project
	rm -rf venv/

clean-build: ## Clean build files
	rm -fr build/
	rm -fr dist/
	rm -fr .eggs/
	find . -name '*.egg-info' -exec rm -fr {} +
	find . -name '*.egg' -exec rm -fr {} +

clean-pyc: ## Clean cache files
	find . -name '*.pyc' -exec rm -f {} +
	find . -name '*.pyo' -exec rm -f {} +
	find . -name '*~' -exec rm -f {} +
	find . -name '__pycache__' -exec rm -fr {} +

clean-test: ## clean test files
	find . -name '.pytest_cache' -exec rm -fr {} +
	rm -fr .tox/
	rm -f .coverage
	rm -fr htmlcov/

install: clean ## Install python virtrual environment
	test -f venv/bin/activate || python3 -m venv  $(CURRENT_ABS_DIR)/venv ;\
	. venv/bin/activate ;\
	pip install --upgrade pip ;\
	pip install --extra-index-url https://download.pytorch.org/whl/cpu -Ur requirements/prod-transformers.txt ;\
	pip freeze | grep -v "pkg-resources" | sort > requirements.txt ;\
	pip install -Ur requirements/dev.txt  ;\
	touch venv/bin/activate  # update so it's as new as requirements/prod.txt

install-dev: ## Install local application
	. venv/bin/activate && pip install -e .

download-models: ## Download the models
	. venv/bin/activate && python3 -c "from transformers import pipeline; pipeline('sentiment-analysis', model='${MODEL_ID}', truncation=True)"

#################################################################################
# COMMANDS - CI                                                                 #
#################################################################################
ci: lint test ## CI flow

format: ## Code auto format python code with black & isort
	. venv/bin/activate && isort --settings-path setup.cfg src/${PROJECT_NAME} && black src/$(PROJECT_NAME)

pylint: ## Linting with pylint
	. venv/bin/activate && pylint --rcfile=setup.cfg  src/$(PROJECT_NAME)

flake8: ## Linting with flake8
	. venv/bin/activate && flake8 src/$(PROJECT_NAME) tests

lint: format pylint flake8 ## run all lint type scripts

test: ## Unit testing
	. venv/bin/activate && pytest


#################################################################################
# COMMANDS - Local                                                              #
#################################################################################
run: ## Run the project in local
	. venv/bin/activate && python -m flask run -p 5000

#################################################################################
# Self Documenting Commands                                                     #
#################################################################################
.PHONY: help

.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
