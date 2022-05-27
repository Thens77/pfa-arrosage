package com.iir4.emsi.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.iir4.emsi.IntegrationTest;
import com.iir4.emsi.domain.EspaceVert;
import com.iir4.emsi.repository.EspaceVertRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link EspaceVertResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EspaceVertResourceIT {

    private static final String DEFAULT_LIBELLE = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PHOTO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PHOTO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PHOTO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PHOTO_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/espace-verts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EspaceVertRepository espaceVertRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEspaceVertMockMvc;

    private EspaceVert espaceVert;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EspaceVert createEntity(EntityManager em) {
        EspaceVert espaceVert = new EspaceVert().libelle(DEFAULT_LIBELLE).photo(DEFAULT_PHOTO).photoContentType(DEFAULT_PHOTO_CONTENT_TYPE);
        return espaceVert;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EspaceVert createUpdatedEntity(EntityManager em) {
        EspaceVert espaceVert = new EspaceVert().libelle(UPDATED_LIBELLE).photo(UPDATED_PHOTO).photoContentType(UPDATED_PHOTO_CONTENT_TYPE);
        return espaceVert;
    }

    @BeforeEach
    public void initTest() {
        espaceVert = createEntity(em);
    }

    @Test
    @Transactional
    void createEspaceVert() throws Exception {
        int databaseSizeBeforeCreate = espaceVertRepository.findAll().size();
        // Create the EspaceVert
        restEspaceVertMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(espaceVert)))
            .andExpect(status().isCreated());

        // Validate the EspaceVert in the database
        List<EspaceVert> espaceVertList = espaceVertRepository.findAll();
        assertThat(espaceVertList).hasSize(databaseSizeBeforeCreate + 1);
        EspaceVert testEspaceVert = espaceVertList.get(espaceVertList.size() - 1);
        assertThat(testEspaceVert.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
        assertThat(testEspaceVert.getPhoto()).isEqualTo(DEFAULT_PHOTO);
        assertThat(testEspaceVert.getPhotoContentType()).isEqualTo(DEFAULT_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createEspaceVertWithExistingId() throws Exception {
        // Create the EspaceVert with an existing ID
        espaceVert.setId(1L);

        int databaseSizeBeforeCreate = espaceVertRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEspaceVertMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(espaceVert)))
            .andExpect(status().isBadRequest());

        // Validate the EspaceVert in the database
        List<EspaceVert> espaceVertList = espaceVertRepository.findAll();
        assertThat(espaceVertList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEspaceVerts() throws Exception {
        // Initialize the database
        espaceVertRepository.saveAndFlush(espaceVert);

        // Get all the espaceVertList
        restEspaceVertMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(espaceVert.getId().intValue())))
            .andExpect(jsonPath("$.[*].libelle").value(hasItem(DEFAULT_LIBELLE)))
            .andExpect(jsonPath("$.[*].photoContentType").value(hasItem(DEFAULT_PHOTO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].photo").value(hasItem(Base64Utils.encodeToString(DEFAULT_PHOTO))));
    }

    @Test
    @Transactional
    void getEspaceVert() throws Exception {
        // Initialize the database
        espaceVertRepository.saveAndFlush(espaceVert);

        // Get the espaceVert
        restEspaceVertMockMvc
            .perform(get(ENTITY_API_URL_ID, espaceVert.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(espaceVert.getId().intValue()))
            .andExpect(jsonPath("$.libelle").value(DEFAULT_LIBELLE))
            .andExpect(jsonPath("$.photoContentType").value(DEFAULT_PHOTO_CONTENT_TYPE))
            .andExpect(jsonPath("$.photo").value(Base64Utils.encodeToString(DEFAULT_PHOTO)));
    }

    @Test
    @Transactional
    void getNonExistingEspaceVert() throws Exception {
        // Get the espaceVert
        restEspaceVertMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEspaceVert() throws Exception {
        // Initialize the database
        espaceVertRepository.saveAndFlush(espaceVert);

        int databaseSizeBeforeUpdate = espaceVertRepository.findAll().size();

        // Update the espaceVert
        EspaceVert updatedEspaceVert = espaceVertRepository.findById(espaceVert.getId()).get();
        // Disconnect from session so that the updates on updatedEspaceVert are not directly saved in db
        em.detach(updatedEspaceVert);
        updatedEspaceVert.libelle(UPDATED_LIBELLE).photo(UPDATED_PHOTO).photoContentType(UPDATED_PHOTO_CONTENT_TYPE);

        restEspaceVertMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEspaceVert.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEspaceVert))
            )
            .andExpect(status().isOk());

        // Validate the EspaceVert in the database
        List<EspaceVert> espaceVertList = espaceVertRepository.findAll();
        assertThat(espaceVertList).hasSize(databaseSizeBeforeUpdate);
        EspaceVert testEspaceVert = espaceVertList.get(espaceVertList.size() - 1);
        assertThat(testEspaceVert.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testEspaceVert.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testEspaceVert.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingEspaceVert() throws Exception {
        int databaseSizeBeforeUpdate = espaceVertRepository.findAll().size();
        espaceVert.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEspaceVertMockMvc
            .perform(
                put(ENTITY_API_URL_ID, espaceVert.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(espaceVert))
            )
            .andExpect(status().isBadRequest());

        // Validate the EspaceVert in the database
        List<EspaceVert> espaceVertList = espaceVertRepository.findAll();
        assertThat(espaceVertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEspaceVert() throws Exception {
        int databaseSizeBeforeUpdate = espaceVertRepository.findAll().size();
        espaceVert.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEspaceVertMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(espaceVert))
            )
            .andExpect(status().isBadRequest());

        // Validate the EspaceVert in the database
        List<EspaceVert> espaceVertList = espaceVertRepository.findAll();
        assertThat(espaceVertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEspaceVert() throws Exception {
        int databaseSizeBeforeUpdate = espaceVertRepository.findAll().size();
        espaceVert.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEspaceVertMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(espaceVert)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the EspaceVert in the database
        List<EspaceVert> espaceVertList = espaceVertRepository.findAll();
        assertThat(espaceVertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEspaceVertWithPatch() throws Exception {
        // Initialize the database
        espaceVertRepository.saveAndFlush(espaceVert);

        int databaseSizeBeforeUpdate = espaceVertRepository.findAll().size();

        // Update the espaceVert using partial update
        EspaceVert partialUpdatedEspaceVert = new EspaceVert();
        partialUpdatedEspaceVert.setId(espaceVert.getId());

        partialUpdatedEspaceVert.libelle(UPDATED_LIBELLE);

        restEspaceVertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEspaceVert.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEspaceVert))
            )
            .andExpect(status().isOk());

        // Validate the EspaceVert in the database
        List<EspaceVert> espaceVertList = espaceVertRepository.findAll();
        assertThat(espaceVertList).hasSize(databaseSizeBeforeUpdate);
        EspaceVert testEspaceVert = espaceVertList.get(espaceVertList.size() - 1);
        assertThat(testEspaceVert.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testEspaceVert.getPhoto()).isEqualTo(DEFAULT_PHOTO);
        assertThat(testEspaceVert.getPhotoContentType()).isEqualTo(DEFAULT_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateEspaceVertWithPatch() throws Exception {
        // Initialize the database
        espaceVertRepository.saveAndFlush(espaceVert);

        int databaseSizeBeforeUpdate = espaceVertRepository.findAll().size();

        // Update the espaceVert using partial update
        EspaceVert partialUpdatedEspaceVert = new EspaceVert();
        partialUpdatedEspaceVert.setId(espaceVert.getId());

        partialUpdatedEspaceVert.libelle(UPDATED_LIBELLE).photo(UPDATED_PHOTO).photoContentType(UPDATED_PHOTO_CONTENT_TYPE);

        restEspaceVertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEspaceVert.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEspaceVert))
            )
            .andExpect(status().isOk());

        // Validate the EspaceVert in the database
        List<EspaceVert> espaceVertList = espaceVertRepository.findAll();
        assertThat(espaceVertList).hasSize(databaseSizeBeforeUpdate);
        EspaceVert testEspaceVert = espaceVertList.get(espaceVertList.size() - 1);
        assertThat(testEspaceVert.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testEspaceVert.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testEspaceVert.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingEspaceVert() throws Exception {
        int databaseSizeBeforeUpdate = espaceVertRepository.findAll().size();
        espaceVert.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEspaceVertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, espaceVert.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(espaceVert))
            )
            .andExpect(status().isBadRequest());

        // Validate the EspaceVert in the database
        List<EspaceVert> espaceVertList = espaceVertRepository.findAll();
        assertThat(espaceVertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEspaceVert() throws Exception {
        int databaseSizeBeforeUpdate = espaceVertRepository.findAll().size();
        espaceVert.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEspaceVertMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(espaceVert))
            )
            .andExpect(status().isBadRequest());

        // Validate the EspaceVert in the database
        List<EspaceVert> espaceVertList = espaceVertRepository.findAll();
        assertThat(espaceVertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEspaceVert() throws Exception {
        int databaseSizeBeforeUpdate = espaceVertRepository.findAll().size();
        espaceVert.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEspaceVertMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(espaceVert))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EspaceVert in the database
        List<EspaceVert> espaceVertList = espaceVertRepository.findAll();
        assertThat(espaceVertList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEspaceVert() throws Exception {
        // Initialize the database
        espaceVertRepository.saveAndFlush(espaceVert);

        int databaseSizeBeforeDelete = espaceVertRepository.findAll().size();

        // Delete the espaceVert
        restEspaceVertMockMvc
            .perform(delete(ENTITY_API_URL_ID, espaceVert.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EspaceVert> espaceVertList = espaceVertRepository.findAll();
        assertThat(espaceVertList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
