<template x-if="selectedNode &&selectedNode.id !== 'root'">
    <form id="skill-editor">
        <h2>Informations</h2>
        <template x-for="(field, fieldName) in getNodeTypeByNode(selectedNode).fields">
            <div x-html="renderField(fieldName, field, selectedNode)"></div>
        </template>
    </form>
</template>