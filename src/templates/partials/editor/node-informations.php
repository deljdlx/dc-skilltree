<template x-if="selectedNode.id !== 'root'">
    <form id="skill-editor">
        <h2>Informations</h2>

        <fieldset>
            <label class="input input-bordered flex items-center gap-2">
                Nom :
                <input x-on:input="updateSelectedNode" x-model="selectedNode.text" name="name" type="text" class="grow" placeholder="" />
            </label>
        </fieldset>

        <!-- ============================================== -->

        <fieldset>
            <label>
                Illustration :
            </label>
            <input id="imageUploader" x-on:input="updateSelectedNode" name="image" type="file" class="grow" placeholder="" />
            <div id="imagePreview" style="display: none"></div>
        </fieldset>

        <!-- ============================================== -->

        <template x-if="selectedNode.data.illustration">
            <fieldset>
                <img :src="selectedNode.data.illustration"/>
            </fieldset>
        </template>

        <!-- ============================================== -->

        <fieldset>
            <label>
                Description :
            </label>
            <div>
                <textarea x-on:input="updateSelectedNode" x-model="selectedNode.data.description" name="description" class="quill textarea textarea-bordered w-full grow"></textarea>
            <div>
        </fieldset>

        <!-- ============================================== -->

        <fieldset>
            <label class="input input-bordered flex items-center gap-2">
                Code :
                <input x-on:input="updateSelectedNode" x-model="selectedNode.data.code" name="code" type="text" class="grow" placeholder="" />
            </label>
        </fieldset>

        <!-- ============================================== -->

        <fieldset>
            <label>
                Valeur :
            </label>
            <div>

                <div class="code" data-field-name="value" data-lines="1"></div>
            <div>
        </fieldset>

        <!-- ============================================== -->

        <fieldset>
            <label>
                Modificateurs :
            </label>
            <div>
                <div class="code" data-field-name="modifiers" data-lines="10"></div>
            <div>
        </fieldset>
    </form>
</template>