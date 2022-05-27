package com.iir4.emsi.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.iir4.emsi.IntegrationTest;
import com.iir4.emsi.domain.Plante;
import com.iir4.emsi.repository.PlanteRepository;
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
 * Integration tests for the {@link PlanteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PlanteResourceIT {

    private static final String DEFAULT_LIBELLE = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PHOTO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PHOTO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PHOTO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PHOTO_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/plantes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PlanteRepository planteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPlanteMockMvc;

    private Plante plante;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Plante createEntity(EntityManager em) {
        Plante plante = new Plante().libelle(DEFAULT_LIBELLE).photo(DEFAULT_PHOTO).photoContentType(DEFAULT_PHOTO_CONTENT_TYPE);
        return plante;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Plante createUpdatedEntity(EntityManager em) {
        Plante plante = new Plante().libelle(UPDATED_LIBELLE).photo(UPDATED_PHOTO).photoContentType(UPDATED_PHOTO_CONTENT_TYPE);
        return plante;
    }

    @BeforeEach
    public void initTest() {
        plante = createEntity(em);
    }

    @Test
    @Transactional
    void createPlante() throws Exception {
        int databaseSizeBeforeCreate = planteRepository.findAll().size();
        // Create the Plante
        restPlanteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(plante)))
            .andExpect(status().isCreated());

        // Validate the Plante in the database
        List<Plante> planteList = planteRepository.findAll();
        assertThat(planteList).hasSize(databaseSizeBeforeCreate + 1);
        Plante testPlante = planteList.get(planteList.size() - 1);
        assertThat(testPlante.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
        assertThat(testPlante.getPhoto()).isEqualTo(DEFAULT_PHOTO);
        assertThat(testPlante.getPhotoContentType()).isEqualTo(DEFAULT_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createPlanteWithExistingId() throws Exception {
        // Create the Plante with an existing ID
        plante.setId(1L);

        int databaseSizeBeforeCreate = planteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlanteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(plante)))
            .andExpect(status().isBadRequest());

        // Validate the Plante in the database
        List<Plante> planteList = planteRepository.findAll();
        assertThat(planteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPlantes() throws Exception {
        // Initialize the database
        planteRepository.saveAndFlush(plante);

        // Get all the planteList
        restPlanteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(plante.getId().intValue())))
            .andExpect(jsonPath("$.[*].libelle").value(hasItem(DEFAULT_LIBELLE)))
            .andExpect(jsonPath("$.[*].photoContentType").value(hasItem(DEFAULT_PHOTO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].photo").value(hasItem(Base64Utils.encodeToString(DEFAULT_PHOTO))));
    }

    @Test
    @Transactional
    void getPlante() throws Exception {
        // Initialize the database
        planteRepository.saveAndFlush(plante);

        // Get the plante
        restPlanteMockMvc
            .perform(get(ENTITY_API_URL_ID, plante.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(plante.getId().intValue()))
            .andExpect(jsonPath("$.libelle").value(DEFAULT_LIBELLE))
            .andExpect(jsonPath("$.photoContentType").value(DEFAULT_PHOTO_CONTENT_TYPE))
            .andExpect(jsonPath("$.photo").value(Base64Utils.encodeToString(DEFAULT_PHOTO)));
    }

    @Test
    @Transactional
    void getNonExistingPlante() throws Exception {
        // Get the plante
        restPlanteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPlante() throws Exception {
        // Initialize the database
        planteRepository.saveAndFlush(plante);

        int databaseSizeBeforeUpdate = planteRepository.findAll().size();

        // Update the plante
        Plante updatedPlante = planteRepository.findById(plante.getId()).get();
        // Disconnect from session so that the updates on updatedPlante are not directly saved in db
        em.detach(updatedPlante);
        updatedPlante.libelle(UPDATED_LIBELLE).photo(UPDATED_PHOTO).photoContentType(UPDATED_PHOTO_CONTENT_TYPE);

        restPlanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPlante.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPlante))
            )
            .andExpect(status().isOk());

        // Validate the Plante in the database
        List<Plante> planteList = planteRepository.findAll();
        assertThat(planteList).hasSize(databaseSizeBeforeUpdate);
        Plante testPlante = planteList.get(planteList.size() - 1);
        assertThat(testPlante.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testPlante.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testPlante.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingPlante() throws Exception {
        int databaseSizeBeforeUpdate = planteRepository.findAll().size();
        plante.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, plante.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(plante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plante in the database
        List<Plante> planteList = planteRepository.findAll();
        assertThat(planteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPlante() throws Exception {
        int databaseSizeBeforeUpdate = planteRepository.findAll().size();
        plante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlanteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(plante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plante in the database
        List<Plante> planteList = planteRepository.findAll();
        assertThat(planteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPlante() throws Exception {
        int databaseSizeBeforeUpdate = planteRepository.findAll().size();
        plante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlanteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(plante)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Plante in the database
        List<Plante> planteList = planteRepository.findAll();
        assertThat(planteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePlanteWithPatch() throws Exception {
        // Initialize the database
        planteRepository.saveAndFlush(plante);

        int databaseSizeBeforeUpdate = planteRepository.findAll().size();

        // Update the plante using partial update
        Plante partialUpdatedPlante = new Plante();
        partialUpdatedPlante.setId(plante.getId());

        restPlanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPlante))
            )
            .andExpect(status().isOk());

        // Validate the Plante in the database
        List<Plante> planteList = planteRepository.findAll();
        assertThat(planteList).hasSize(databaseSizeBeforeUpdate);
        Plante testPlante = planteList.get(planteList.size() - 1);
        assertThat(testPlante.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
        assertThat(testPlante.getPhoto()).isEqualTo(DEFAULT_PHOTO);
        assertThat(testPlante.getPhotoContentType()).isEqualTo(DEFAULT_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdatePlanteWithPatch() throws Exception {
        // Initialize the database
        planteRepository.saveAndFlush(plante);

        int databaseSizeBeforeUpdate = planteRepository.findAll().size();

        // Update the plante using partial update
        Plante partialUpdatedPlante = new Plante();
        partialUpdatedPlante.setId(plante.getId());

        partialUpdatedPlante.libelle(UPDATED_LIBELLE).photo(UPDATED_PHOTO).photoContentType(UPDATED_PHOTO_CONTENT_TYPE);

        restPlanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPlante))
            )
            .andExpect(status().isOk());

        // Validate the Plante in the database
        List<Plante> planteList = planteRepository.findAll();
        assertThat(planteList).hasSize(databaseSizeBeforeUpdate);
        Plante testPlante = planteList.get(planteList.size() - 1);
        assertThat(testPlante.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testPlante.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testPlante.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingPlante() throws Exception {
        int databaseSizeBeforeUpdate = planteRepository.findAll().size();
        plante.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, plante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(plante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plante in the database
        List<Plante> planteList = planteRepository.findAll();
        assertThat(planteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPlante() throws Exception {
        int databaseSizeBeforeUpdate = planteRepository.findAll().size();
        plante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlanteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(plante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plante in the database
        List<Plante> planteList = planteRepository.findAll();
        assertThat(planteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPlante() throws Exception {
        int databaseSizeBeforeUpdate = planteRepository.findAll().size();
        plante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlanteMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(plante)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Plante in the database
        List<Plante> planteList = planteRepository.findAll();
        assertThat(planteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePlante() throws Exception {
        // Initialize the database
        planteRepository.saveAndFlush(plante);

        int databaseSizeBeforeDelete = planteRepository.findAll().size();

        // Delete the plante
        restPlanteMockMvc
            .perform(delete(ENTITY_API_URL_ID, plante.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Plante> planteList = planteRepository.findAll();
        assertThat(planteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
