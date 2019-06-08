.PHONY: help clean clean-pyc clean-build list test test-all coverage docs release sdist

help:
	@echo "clean-build - remove build artifacts"
	@echo "clean-pyc - remove Python file artifacts"
	@echo "lint - check style with flake8"
	@echo "test - run tests quickly with the default Python"
	@echo "test-all - run tests on every Python version with tox"
	@echo "coverage - check code coverage quickly with the default Python"
	@echo "docs - generate Sphinx HTML documentation, including API docs"
	@echo "release - package and upload a release"
	@echo "sdist - package"

clean: clean-build clean-pyc

clean-build:
	rm -fr build/
	rm -fr dist/
	rm -fr *.egg-info

clean-pyc:
	find . -name '*.pyc' -exec rm -f {} +
	find . -name '*.pyo' -exec rm -f {} +
	find . -name '*~' -exec rm -f {} +

lint:
	flake8 stripe_asgi_server tests

test:
	python -m pytest

test-all:
	tox

coverage:
	coverage run --source stripe_asgi_server setup.py tests
	coverage report -m
	coverage html
	open htmlcov/index.html

docs:
	rm -f docs/stripe_asgi_server.rst
	rm -f docs/modules.rst
	sphinx-apidoc -o docs/ stripe_asgi_server
	$(MAKE) -C docs clean
	$(MAKE) -C docs html
	open docs/_build/html/index.html

release: clean
	python setup.py bdist_wheel
	twine upload dist/*

sdist: clean
	python setup.py bdist_wheel
	twine upload dist/*
	ls -l dist
